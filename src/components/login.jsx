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

  const inputCls = "block w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-150 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-400";

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left decorative panel – hidden on mobile */}
      <div className="hidden lg:flex lg:flex-1 bg-gray-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-1 mb-6">
            <span className="text-4xl font-black tracking-tight text-white">PSG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block mx-1" />
            <span className="text-xl font-light tracking-widest text-gray-400 uppercase">SHOP</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Moños elegantes y accesorios de moda de alta calidad para cada ocasión.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-10">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-1 mb-8">
            <span className="text-2xl font-black tracking-tight text-black">PSG</span>
            <span className="w-1 h-1 rounded-full bg-black inline-block mx-1" />
            <span className="text-sm font-light tracking-widest text-gray-500 uppercase">SHOP</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciar Sesión</h1>
          <p className="text-sm text-gray-500 mb-8">Bienvenido de vuelta</p>

          {error && (
            <div className="mb-5 flex gap-2 items-start p-3 rounded-lg bg-red-50 border border-red-200">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 mb-5"
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
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 text-xs text-gray-400 bg-gray-50">o con email</span></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="mail@ejemplo.com" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Contraseña</label>
                <Link to="/reset-password" className="text-xs text-gray-500 hover:text-black transition-colors">¿Olvidaste tu contraseña?</Link>
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            </div>

            <div className="flex items-center gap-2">
              <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-offset-0" />
              <label htmlFor="remember-me" className="text-sm text-gray-600">Recordarme</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-150 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-black hover:underline">Crear una cuenta</Link>
          </p>

          <p className="mt-8 text-center text-xs text-gray-400">©{new Date().getFullYear()} PSG SHOP · Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;