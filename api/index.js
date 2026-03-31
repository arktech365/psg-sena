
// Vercel Serverless Function for Stripe Payments
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Route to check if server is up
app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV }));

// SYNC PRODUCTS
app.post('/api/sync-products', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Lista de productos no válida' });
    }

    const stripeList = await stripe.products.list({ limit: 100, active: true, expand: ['data.default_price'] });
    const stripeProducts = stripeList.data;
    const results = { created: 0, updated: 0, errors: [] };

    for (const prod of products) {
        try {
            const existingProd = stripeProducts.find(s => s.metadata && s.metadata.firestore_id === prod.id);
            const amountInCents = parseInt(parseFloat(prod.price) * 100);

            if (existingProd) {
                const updateData = {
                  name: prod.name,
                  description: prod.description,
                  images: prod.imageUrl ? [prod.imageUrl] : [],
                };
                
                const currentPrice = existingProd.default_price;
                if (currentPrice && currentPrice.unit_amount !== amountInCents) {
                    const oldPriceId = currentPrice.id;
                    const newPrice = await stripe.prices.create({
                        product: existingProd.id,
                        unit_amount: amountInCents,
                        currency: 'cop',
                    });
                    updateData.default_price = newPrice.id;
                    await stripe.products.update(existingProd.id, updateData);
                    await stripe.prices.update(oldPriceId, { active: false });
                } else {
                    await stripe.products.update(existingProd.id, updateData);
                }
                results.updated++;
            } else {
                await stripe.products.create({
                    name: prod.name,
                    description: prod.description,
                    images: prod.imageUrl ? [prod.imageUrl] : [],
                    metadata: { firestore_id: prod.id },
                    default_price_data: { currency: 'cop', unit_amount: amountInCents },
                });
                results.created++;
            }
        } catch (e) {
            results.errors.push({ id: prod.id, error: e.message });
        }
    }
    res.json({ success: true, ...results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE CHECKOUT SESSION
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, shippingCost, discount, successUrl, cancelUrl } = req.body;
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Carrito vacío' });

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'cop',
        product_data: { name: item.name },
        unit_amount: parseInt(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost && shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'cop',
          product_data: { name: 'Costo de Envío' },
          unit_amount: parseInt(parseFloat(shippingCost) * 100),
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

    if (discount && discount > 0) {
        const coupon = await stripe.coupons.create({
            amount_off: parseInt(parseFloat(discount) * 100),
            currency: 'cop',
            duration: 'once',
            name: 'Descuento PSG Shop',
        });
        sessionConfig.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ id: session.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = app;
