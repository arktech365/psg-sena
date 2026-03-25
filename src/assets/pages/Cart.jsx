import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, loading, coupon, applyCoupon, removeCoupon } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplyingCoupon(true); setCouponError('');
    try {
      await applyCoupon(couponCode.trim());
      setCouponCode('');
    } catch (error) {
      setCouponError(error.message || 'Error al aplicar el cupón');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => { removeCoupon(); setCouponCode(''); setCouponError(''); };
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-10 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Tu Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-gray-100 mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Tu carrito está vacío</h3>
            <p className="mt-1 text-sm text-gray-500">Empieza a agregar productos a tu carrito de compras.</p>
            <Link to="/shop" className="inline-flex items-center mt-6 px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-150">
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="p-5 flex gap-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80x80.png?text=PSG'; }}
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-black line-clamp-2 leading-snug">{item.name}</Link>
                            <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 flex-shrink-0">${parseFloat(item.price * item.quantity).toLocaleString('es-CO')}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.stock !== undefined && item.quantity >= item.stock}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-150 flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-5 py-3 border-t border-gray-100">
                  <Link to="/shop" className="text-xs font-medium text-gray-500 hover:text-black transition-colors duration-150 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Continuar comprando
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 lg:mt-0 lg:col-span-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-5">Resumen del Pedido</h2>

                {/* Coupon */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Cupón de descuento</p>
                  {coupon ? (
                    <div className="flex items-center justify-between px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <span className="text-sm font-semibold text-green-800">{coupon.code}</span>
                        <span className="ml-2 text-xs text-green-600">
                          {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%` : `-$${coupon.discountValue.toLocaleString('es-CO')}`}
                        </span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700 transition-colors">Quitar</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Ingresa tu código"
                        className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 disabled:bg-gray-50"
                        disabled={applyingCoupon}
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="px-3 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
                      >
                        {applyingCoupon ? '...' : 'Aplicar'}
                      </button>
                    </form>
                  )}
                  {couponError && <p className="mt-1.5 text-xs text-red-600">{couponError}</p>}
                </div>

                {/* Totals */}
                <div className="space-y-3 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">${parseFloat(subtotal).toLocaleString('es-CO')}</dd>
                  </div>
                  {coupon && (
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-500">Descuento ({coupon.code})</dt>
                      <dd className="text-sm font-medium text-green-600">-${parseFloat(subtotal - getTotalPrice()).toLocaleString('es-CO')}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <dt className="text-base font-semibold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-gray-900">${parseFloat(getTotalPrice()).toLocaleString('es-CO')}</dd>
                  </div>
                </div>

                {/* Stock warning */}
                {items.some(item => item.stock !== undefined && item.stock < item.quantity) && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex gap-2">
                      <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <p className="text-xs text-amber-700">Algunos productos exceden el stock disponible. Ajusta las cantidades.</p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-5 py-3 px-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:bg-gray-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-40"
                  disabled={items.some(item => item.stock !== undefined && item.stock < item.quantity)}
                >
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;