import React, { useState } from 'react';
import { auth, GoogleAuthProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (currentUser) navigate('/home');
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || '',
          profileImage: user.photoURL || '',
          createdAt: new Date(),
          role: 'customer'
        });
      }
      navigate('/home');
    } catch (err) {
      setError('Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found': setError('No se encontró una cuenta con ese correo electrónico.'); break;
        case 'auth/wrong-password': setError('Contraseña incorrecta.'); break;
        case 'auth/invalid-email': setError('El correo electrónico no es válido.'); break;
        case 'auth/user-disabled': setError('Esta cuenta ha sido deshabilitada.'); break;
        default: setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "block w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-400";

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
          <p className="text-sm text-gray-400 font-medium">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="mb-6 flex gap-3 items-start p-4 rounded-xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Google SignIn */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 mb-8 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar con Google
        </button>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center"><span className="px-4 text-xs font-semibold text-gray-400 bg-white uppercase tracking-widest">o con tu email</span></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo Electrónico</label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@ejemplo.com" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Contraseña</label>
              <Link to="/reset-password" name="reset-password-link" className="text-xs font-semibold text-gray-400 hover:text-black transition-colors underline-offset-4 hover:underline">¿La olvidaste?</Link>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 rounded-md border-gray-300 text-black focus:ring-black focus:ring-offset-0 cursor-pointer" />
            <label htmlFor="remember-me" className="text-sm font-medium text-gray-600 cursor-pointer select-none">Recordarme en este equipo</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 active:bg-gray-900 active:scale-[0.99] transition-all duration-200 disabled:opacity-40 shadow-lg shadow-gray-200"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar a mi cuenta'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 font-medium">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" name="register-link" className="font-bold text-black border-b-2 border-black/10 hover:border-black transition-all pb-0.5">Regístrate gratis</Link>
          </p>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          ©{new Date().getFullYear()} PSG SHOP · CALIDAD PREMIUM
        </p>
      </div>
    </div>
  );
};

export default Login;