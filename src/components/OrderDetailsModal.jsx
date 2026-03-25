import React, { useEffect, useRef } from 'react';

const OrderDetailsModal = ({ order, isOpen, onClose, formatDate, formatCurrency, getOrderStatusText, getStatusBadgeClass }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) modalRef.current.scrollTop = 0;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const Section = ({ title, children }) => (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, className = '' }) => (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-medium text-gray-900 ${className}`}>{value}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl mx-auto my-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Detalles del Pedido</h3>
            <p className="text-xs text-gray-400 mt-0.5">#{order.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Order Info */}
          <Section title="Información del Pedido">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoRow label="Fecha" value={formatDate(order.createdAt)} />
              <div>
                <p className="text-xs text-gray-400 mb-1">Estado</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.orderStatus || 'pending')}`}>
                  {getOrderStatusText(order.orderStatus || 'pending')}
                </span>
              </div>
              <InfoRow label="Método de Pago" value={order.paymentMethod || 'N/A'} />
              <InfoRow label="Estado Pago" value={order.paymentStatus || 'N/A'} className="capitalize" />
            </div>
          </Section>

          {/* Customer */}
          <Section title="Cliente">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow label="Correo" value={order.userEmail || 'N/A'} />
              <InfoRow label="ID Usuario" value={order.userId?.substring(0, 8) || 'N/A'} />
            </div>
          </Section>

          {/* Shipping Address */}
          {order.address && (
            <Section title="Dirección de Envío">
              <div className="text-sm space-y-0.5">
                <p className="font-medium text-gray-900">{order.address.name}</p>
                <p className="text-gray-500">{order.address.street}</p>
                <p className="text-gray-500">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                <p className="text-gray-500">{order.address.country}</p>
              </div>
            </Section>
          )}

          {/* Coupon */}
          {order.coupon && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-green-600 mb-3">Cupón aplicado</p>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Código" value={order.coupon.code} />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Descuento</p>
                  <p className="text-sm font-semibold text-green-700">
                    {order.coupon.discountType === 'percentage'
                      ? `${order.coupon.discountValue}%`
                      : formatCurrency(order.coupon.discountValue)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <Section title="Productos">
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/48x48.png?text=PSG'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48x48.png?text=PSG'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Cant: {item.quantity} · Unidad: {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Summary */}
          <Section title="Resumen">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.subtotal || 0)}</span>
              </div>
              {order.coupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Descuento</span>
                  <span className="font-medium text-green-600">-{formatCurrency(order.discount || 0)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className="font-medium text-gray-900">Incluido</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">{formatCurrency(order.totalAmount || 0)}</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;