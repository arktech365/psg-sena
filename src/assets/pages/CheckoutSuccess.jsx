import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: '¡Pago exitoso!',
      text: 'Tu pago ha sido procesado correctamente.',
      icon: 'success',
      confirmButtonText: 'Ir a mis pedidos',
      cancelButtonText: 'Ir al inicio',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¿Te gustaría dejar una reseña?',
          text: 'Ayuda a otros clientes compartiendo tu experiencia.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Dejar reseñas',
          cancelButtonText: 'Más tarde',
          confirmButtonColor: '#111827',
        }).then((reviewResult) => {
          navigate(reviewResult.isConfirmed ? '/orders' : '/home');
        });
      } else {
        navigate('/home');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">¡Pago procesado!</h1>
        <p className="text-sm text-gray-500 mb-6">Estamos preparando tu pedido. Serás redirigido automáticamente.</p>
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default CheckoutSuccess;