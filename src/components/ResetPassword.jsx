import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found': setError('No se encontró una cuenta con ese correo electrónico.'); break;
        case 'auth/invalid-email': setError('El correo electrónico no es válido.'); break;
        default: setError('Error al enviar el correo de restablecimiento. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gray-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-1 mb-6">
            <span className="text-4xl font-black tracking-tight text-white">PSG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block mx-1" />
            <span className="text-xl font-light tracking-widest text-gray-400 uppercase">SHOP</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Recupera el acceso a tu cuenta de forma segura.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-1 mb-8">
            <span className="text-2xl font-black tracking-tight text-black">PSG</span>
            <span className="w-1 h-1 rounded-full bg-black inline-block mx-1" />
            <span className="text-sm font-light tracking-widest text-gray-500 uppercase">SHOP</span>
          </div>

          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 mb-6">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Restablecer Contraseña</h1>
          <p className="text-sm text-gray-500 mb-8">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {/* Success */}
          {message && (
            <div className="mb-5 flex gap-2 items-start p-3 rounded-xl bg-green-50 border border-green-200">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 flex gap-2 items-start p-3 rounded-xl bg-red-50 border border-red-200">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@email.com"
                className="block w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-gray-400 disabled:bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !!message}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!message}
              className="w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-150 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">©{new Date().getFullYear()} PSG SHOP · Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;