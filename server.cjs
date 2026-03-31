
// Simple local server for Stripe Sessions
require('dotenv').config();
const express = require('express');
const cors = require('cors');
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("FATAL: STRIPE_SECRET_KEY no está definido en el archivo .env");
  process.exit(1);
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sincronización masiva de productos (Admin -> Stripe)
app.post('/sync-products', async (req, res) => {
  const { products } = req.body;
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Lista de productos no válida' });
  }

  console.log(`Iniciando sincronización de ${products.length} productos con Stripe...`);
  const results = { created: 0, updated: 0, errors: [] };

  try {
    // Obtenemos todos los productos de Stripe para comparar en memoria y evitar latencia del buscador
    // Expandimos default_price para ver los detalles del monto
    const stripeList = await stripe.products.list({ 
      limit: 100, 
      active: true,
      expand: ['data.default_price']
    });
    const stripeProducts = stripeList.data;

    for (const prod of products) {
      try {
        // Buscamos si ya existe el producto por nuestro ID de Firestore en la metadata
        const existingProd = stripeProducts.find(s => s.metadata && s.metadata.firestore_id === prod.id);

        const amountInCents = parseInt(parseFloat(prod.price) * 100);

        if (existingProd) {
          // Existe: Actualizamos info básica
          const updateData = {
            name: prod.name,
            description: prod.description,
            images: prod.imageUrl ? [prod.imageUrl] : [],
          };

          // Verificamos si el precio cambió (comparando con el precio actual en Stripe si está disponible)
          // Nota: Traemos los detalles del precio para comparar el monto real pasándolo como expansión
          const currentPrice = existingProd.default_price && typeof existingProd.default_price === 'object' 
            ? existingProd.default_price 
            : null;

          if (currentPrice && currentPrice.unit_amount !== amountInCents) {
            // El precio ha cambiado: Guardamos el ID anterior para archivarlo DESPUÉS
            const oldPriceId = currentPrice.id;

            // 1. Creamos un nuevo objeto Price
            const newPrice = await stripe.prices.create({
              product: existingProd.id,
              unit_amount: amountInCents,
              currency: 'cop',
            });

            // 2. Primero actualizamos el producto para que use el NUEVO precio como predeterminado
            // Esto libera el precio antiguo de ser el "default"
            await stripe.products.update(existingProd.id, {
              ...updateData,
              default_price: newPrice.id
            });

            // 3. Ahora que el antiguo ya no es el predeterminado, podemos archivarlo sin errores
            await stripe.prices.update(oldPriceId, { active: false });
            
            console.log(`Precio actualizado (Nuevo default: ${newPrice.id}) y antiguo archivado (${oldPriceId}) para ${prod.name}`);
            
            // Ya hicimos el update, así que saltamos el update final de abajo para este caso
            results.updated++;
            continue;
          } else if (!currentPrice && amountInCents > 0) {
              // Si no tenía precio predeterminado, se lo ponemos
              const newPrice = await stripe.prices.create({
                product: existingProd.id,
                unit_amount: amountInCents,
                currency: 'cop',
              });
              updateData.default_price = newPrice.id;
          }

          await stripe.products.update(existingProd.id, updateData);
          results.updated++;
        } else {
          // No existe: Creamos
          await stripe.products.create({
            name: prod.name,
            description: prod.description,
            images: prod.imageUrl ? [prod.imageUrl] : [],
            metadata: { firestore_id: prod.id },
            default_price_data: {
              currency: 'cop',
              unit_amount: amountInCents,
            },
          });
          results.created++;
        }
      } catch (e) {
        console.error(`Error sincronizando producto ${prod.id}:`, e.message);
        results.errors.push({ id: prod.id, error: e.message });
      }
    }
    
    res.json({ success: true, ...results });
    console.log(`Sincronización terminada: ${results.created} creados, ${results.updated} actualizados.`);
  } catch (err) {
    console.error("Error fatal en sincronización:", err.message);
    res.status(500).json({ error: err.message });
  }
});
app.post('/create-checkout-session', async (req, res) => {
  console.log("Nueva petición de pago recibida...");
  const { cartItems, shippingCost, discount, successUrl, cancelUrl } = req.body;

  if (!cartItems || cartItems.length === 0) {
    console.log("Error: Carrito vacío");
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  console.log(`Procesando ${cartItems.length} productos...`);
  
  let totalAmount = 0;
  const line_items = cartItems.map(item => {
    const amountInCents = parseInt(parseFloat(item.price) * 100);
    totalAmount += amountInCents * item.quantity;
    return {
      price_data: {
        currency: 'cop',
        product_data: { name: item.name },
        unit_amount: amountInCents,
      },
      quantity: item.quantity,
    };
  });

  if (shippingCost && shippingCost > 0) {
    const shippingInCents = parseInt(parseFloat(shippingCost) * 100);
    totalAmount += shippingInCents;
    line_items.push({
      price_data: {
        currency: 'cop',
        product_data: { name: 'Costo de Envío' },
        unit_amount: shippingInCents,
      },
      quantity: 1,
    });
  }

  const sessionConfig = {
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  // Manejo de descuentos mediante Cupones temporales de Stripe
  if (discount && discount > 0) {
    const discountInCents = parseInt(parseFloat(discount) * 100);
    const coupon = await stripe.coupons.create({
      amount_off: discountInCents,
      currency: 'cop',
      duration: 'once',
      name: 'Descuento PSG Shop',
    });
    sessionConfig.discounts = [{ coupon: coupon.id }];
  }

  console.log(`Total bruto: ${totalAmount / 100} COP. Descuento: ${discount || 0} COP.`);

  try {
    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ id: session.id });
    console.log("Sesión creada con éxito:", session.id);
  } catch (e) {
    console.error("Error completo de Stripe:", JSON.stringify(e, null, 2));
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on all interfaces at PORT ${PORT}`));
