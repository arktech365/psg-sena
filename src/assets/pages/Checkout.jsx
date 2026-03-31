import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S8kdbBqZW5OQI7pv3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ3OQ');

const Checkout = () => {
  const { items, getTotalPrice, loading: cartLoading, clearCart, coupon } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // URL del servidor (local o producción en Vercel)
  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : '/api';

  const EXCHANGE_RATE = 0.00028;
  const convertToUSD = (cop) => cop * EXCHANGE_RATE;

  const getPrimaryImageUrl = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const valid = product.imageUrls.filter(img => img && (typeof img === 'string' || (img.data && typeof img.data === 'string')));
      if (valid.length > 0) {
        const safe = Math.min(product.primaryImageIndex || 0, valid.length - 1);
        const img = valid[safe];
        if (typeof img === 'string') return img;
        if (img && img.data) return img.data;
      }
    }
    return product.imageUrl || 'https://via.placeholder.com/100x100.png?text=PSG';
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', zipCode: '', country: 'Colombia' });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const originLocation = { city: 'Cajamarca', state: 'Tolima', country: 'Colombia' };
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = coupon ? subtotal - getTotalPrice() : 0;
  const total = getTotalPrice() + shippingCost;

  const calculateShippingCost = (dest) => {
    if (!dest) return 0;
    if (dest.city?.toLowerCase() === originLocation.city.toLowerCase() && dest.state?.toLowerCase() === originLocation.state.toLowerCase()) return 5000;
    if (dest.state?.toLowerCase() === originLocation.state.toLowerCase()) return 15000;
    if (dest.country?.toLowerCase() === 'colombia') return 25000;
    return 50000;
  };

  const isLocalDelivery = (addr) => !!(addr && addr.city?.toLowerCase() === originLocation.city.toLowerCase() && addr.state?.toLowerCase() === originLocation.state.toLowerCase());

  useEffect(() => { setShippingCost(calculateShippingCost(selectedAddress)); }, [selectedAddress]);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!currentUser) { navigate('/login'); return; }
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const addrs = snap.data().addresses || [];
          setAddresses(addrs);
          const def = addrs.find(a => a.isDefault) || addrs[0] || null;
          setSelectedAddress(def);
        }
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Error al cargar las direcciones', icon: 'error', confirmButtonText: 'Aceptar' });
      } finally { setLoading(false); }
    };
    loadAddresses();
  }, [currentUser, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      Swal.fire({ title: 'Error', text: 'Por favor completa todos los campos', icon: 'error', confirmButtonText: 'Aceptar' });
      return;
    }
    try {
      const newAddr = { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 };
      await updateDoc(doc(db, 'users', currentUser.uid), { addresses: [...addresses, newAddr] });
      const updated = [...addresses, newAddr];
      setAddresses(updated); setSelectedAddress(newAddr); setShowNewAddressForm(false);
      setNewAddress({ name: '', street: '', city: '', state: '', zipCode: '', country: 'Colombia' });
      Swal.fire({ title: 'Dirección agregada', text: 'Dirección guardada correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Error al agregar la dirección: ' + err.message, icon: 'error', confirmButtonText: 'Aceptar' });
    }
  };

  const createOrder = async (paymentMethod, paymentStatus) => {
    // Limpiamos los items para que no pesen demasiado (evita error de 1MB en Firestore)
    // Especialmente si los productos tienen imágenes en Base64
    const cleanItems = items.map(it => ({
      id: it.id || '',
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      selectedSize: it.selectedSize || null,
      selectedColor: it.selectedColor || null,
      // Solo guardamos la URL de la imagen si NO es un Base64 pesado
      imageUrl: (it.imageUrl && !it.imageUrl.startsWith('data:')) ? it.imageUrl : null
    }));

    const orderData = {
      userId: currentUser.uid, userEmail: currentUser.email,
      items: cleanItems, subtotal: parseFloat(subtotal), discount: parseFloat(discount),
      shippingCost: parseFloat(shippingCost), totalAmount: parseFloat(total),
      totalAmountUSD: parseFloat(convertToUSD(total).toFixed(2)),
      address: selectedAddress, paymentMethod, paymentStatus,
      orderStatus: 'pending', coupon: coupon || null,
      createdAt: new Date(), updatedAt: new Date()
    };
    const ref = await addDoc(collection(db, 'orders'), orderData);
    return ref.id;
  };

  const handlePayPalSuccess = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      setProcessing(true);
      try {
        await createOrder('PayPal', 'completed');
        clearCart();
        Swal.fire({ title: '¡Pago exitoso!', text: `Gracias por tu compra, ${details.payer.name.given_name}!`, icon: 'success', confirmButtonText: 'Ir a mis pedidos' }).then(() => navigate('/orders'));
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Error al procesar tu pedido. Contacta al soporte.', icon: 'error', confirmButtonText: 'Aceptar' });
      } finally { setProcessing(false); }
    });
  };

  const handlePayPalError = (err) => {
    Swal.fire({ title: 'Error', text: 'Error en el pago con PayPal. Intenta nuevamente.', icon: 'error', confirmButtonText: 'Aceptar' });
  };

  const handleStripeCheckout = async () => {
    if (!selectedAddress) {
      Swal.fire({ title: 'Error', text: 'Selecciona una dirección de envío', icon: 'error', confirmButtonText: 'Aceptar' });
      return;
    }
    
    setProcessing(true);
    try {
      // 1. Crear el pedido en Firestore primero con estado 'Pendiente de Pago (Stripe)'
      // para que el administrador ya pueda verlo.
      const orderId = await createOrder('Stripe', 'pending_stripe');

      // 2. Optimizamos los items para que no pesen tanto
      const cleanItems = items.map(it => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity
      }));

      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cleanItems,
          shippingCost: shippingCost,
          discount: discount,
          successUrl: `${window.location.origin}${window.location.hostname.includes('github.io') ? '/psg-official' : ''}/#/orders?payment=success&orderId=${orderId}`,
          cancelUrl: `${window.location.origin}${window.location.hostname.includes('github.io') ? '/psg-official' : ''}/#/checkout`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorText.substring(0, 50)}...`);
      }

      const session = await response.json();
      if (!session.id) throw new Error(session.error || 'No se pudo crear la sesión');

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe no se pudo cargar');
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) throw error;
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Stripe Error: ' + err.message, icon: 'error', confirmButtonText: 'Aceptar' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!selectedAddress) { Swal.fire({ title: 'Error', text: 'Selecciona una dirección de envío', icon: 'error', confirmButtonText: 'Aceptar' }); return; }
    setProcessing(true);
    try {
      await createOrder('Cash on Delivery', 'pending'); clearCart();
      Swal.fire({ title: 'Pedido confirmado', text: 'Pagarás contra entrega.', icon: 'success', confirmButtonText: 'Ver mis pedidos' }).then(() => navigate('/orders'));
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Error al procesar el pedido: ' + err.message, icon: 'error', confirmButtonText: 'Aceptar' });
    } finally { setProcessing(false); }
  };

  const inputCls = "block w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-gray-400";

  if (cartLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-10 mx-auto max-w-6xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Finalizar Compra</h1>
          <p className="text-sm text-gray-500 mt-1">Revisa tus datos antes de confirmar el pedido</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">

          {/* ─── Left Column ─── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Dirección de Envío</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Selecciona o agrega una dirección</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(v => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    {addresses.length === 0 ? 'Agregar dirección' : 'Nueva dirección'}
                  </button>
                </div>
              </div>

              <div className="px-6 py-5">
                {addresses.length === 0 && !showNewAddressForm && (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">No hay direcciones guardadas</p>
                    <p className="text-xs text-gray-400 mt-0.5">Agrega una para continuar</p>
                  </div>
                )}

                {addresses.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                          selectedAddress?.id === addr.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedAddress?.id === addr.id ? 'border-black' : 'border-gray-300'}`}>
                          {selectedAddress?.id === addr.id && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                            {addr.isDefault && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">Predeterminada</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{addr.street}</p>
                          <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zipCode} · {addr.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showNewAddressForm && (
                  <div className={`${addresses.length > 0 ? 'pt-5 border-t border-gray-100' : ''}`}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Nueva Dirección</p>
                    <form onSubmit={handleAddNewAddress}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                          { name: 'name', label: 'Nombre de la Dirección', placeholder: 'Ej: Casa, Trabajo' },
                          { name: 'street', label: 'Calle y Número', placeholder: 'Av. Principal 123' },
                          { name: 'city', label: 'Ciudad', placeholder: 'Bogotá' },
                          { name: 'state', label: 'Departamento', placeholder: 'Cundinamarca' },
                          { name: 'zipCode', label: 'Código Postal', placeholder: '110111' },
                        ].map(({ name, label, placeholder }) => (
                          <div key={name}>
                            <label htmlFor={name} className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
                            <input type="text" name={name} id={name} value={newAddress[name]} onChange={handleAddressChange} placeholder={placeholder} className={inputCls} />
                          </div>
                        ))}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">País</label>
                          <input type="text" value="Colombia" disabled className={`${inputCls} bg-gray-50 text-gray-400`} />
                          <p className="mt-1 text-xs text-gray-400">Solo operamos en Colombia</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-5">
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">Guardar Dirección</button>
                        <button type="button" onClick={() => setShowNewAddressForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Productos del Pedido</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id} className="px-6 py-4 flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                      <img
                        src={getPrimaryImageUrl(item)} alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64x64.png?text=PSG'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{item.name}</p>
                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">${parseFloat(item.price * item.quantity).toLocaleString('es-CO')}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category} · Cant: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── Right Column: Summary + Payment ─── */}
          <div className="mt-6 lg:mt-0 lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Resumen del Pedido</h2>

              {/* Totals */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">${parseFloat(subtotal).toLocaleString('es-CO')}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Descuento ({coupon.code})</span>
                    <span className="font-medium text-green-600">-${parseFloat(discount).toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium text-gray-900">${parseFloat(shippingCost).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">${parseFloat(total).toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Selected Address Preview */}
              {selectedAddress && (
                <div className="mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Enviar a</p>
                  <p className="text-xs font-semibold text-gray-900">{selectedAddress.name}</p>
                  <p className="text-xs text-gray-500">{selectedAddress.street}</p>
                  <p className="text-xs text-gray-500">{selectedAddress.city}, {selectedAddress.state}</p>
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Método de Pago</p>

                {/* Stripe/Card Payment */}
                <div className="mb-3">
                  {selectedAddress ? (
                    <button
                      onClick={() => handleStripeCheckout()}
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-indigo-600 rounded-xl text-sm font-black text-white hover:bg-indigo-700 transition-all hover:shadow-xl active:scale-95 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {processing ? 'Procesando...' : 'Pagar con Tarjeta (Stripe)'}
                    </button>
                  ) : null}
                </div>

                {/* PayPal */}
                <div className="mb-3">
                  {selectedAddress ? (
                    <PayPalButtons
                      style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                      createOrder={(data, actions) => actions.order.create({
                        purchase_units: [{ amount: { value: convertToUSD(total).toFixed(2), currency_code: 'USD' } }]
                      })}
                      onApprove={handlePayPalSuccess}
                      onError={handlePayPalError}
                    />
                  ) : (
                    <div className="py-3 px-4 border border-gray-200 rounded-xl text-center">
                      <p className="text-xs text-gray-400">Selecciona una dirección para activar el pago</p>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery – local only */}
                {isLocalDelivery(selectedAddress) && (
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={processing || !selectedAddress}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    {processing ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {processing ? 'Procesando...' : 'Pagar Contra Entrega'}
                  </button>
                )}

                {/* Info for non-local */}
                {!isLocalDelivery(selectedAddress) && selectedAddress && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-700 text-center">El pago contra entrega solo está disponible en Cajamarca. Usa PayPal para otras ubicaciones.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/cart')}
                className="mt-5 flex items-center justify-center gap-1 w-full text-xs text-gray-400 hover:text-black transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Volver al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;