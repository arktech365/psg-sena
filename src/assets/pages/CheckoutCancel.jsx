import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CheckoutCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: 'Pago cancelado',
      text: 'El pago ha sido cancelado. Puedes intentar nuevamente.',
      icon: 'info',
      confirmButtonText: 'Reintentar',
      cancelButtonText: 'Ir al carrito',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      navigate(result.isConfirmed ? '/checkout' : '/cart');
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Pago cancelado</h1>
        <p className="text-sm text-gray-500 mb-6">No se realizó ningún cargo. Serás redirigido automáticamente.</p>
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default CheckoutCancel;