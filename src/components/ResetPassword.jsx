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
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-3xl font-black tracking-tight text-black">PSG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-black inline-block mt-1" />
            <span className="text-base font-light tracking-widest text-gray-500 uppercase">SHOP</span>
          </div>
          <p className="text-sm text-gray-400 font-medium text-center">Recupera el acceso a tu cuenta</p>
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mx-auto mb-8 border border-gray-100">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-sm text-gray-500 font-medium">
            Ingresa tu email y te enviaremos las instrucciones de recuperación.
          </p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-8 flex gap-3 items-start p-4 rounded-xl bg-green-50 border border-green-100 animate-in fade-in">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700 font-medium leading-relaxed">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-8 flex gap-3 items-start p-4 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-address" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">
              Correo Electrónico
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@email.com"
              className="block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 transition-all placeholder-gray-400 disabled:bg-gray-50 text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!message}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!message}
            className="w-full py-3.5 px-4 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 active:bg-gray-900 active:scale-[0.99] transition-all duration-200 disabled:opacity-40 shadow-lg shadow-gray-200"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/login" name="login-link" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          ©{new Date().getFullYear()} PSG SHOP · SEGURIDAD TOTAL
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;