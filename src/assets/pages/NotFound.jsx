import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiTrendingUp } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32 pb-24">
      <div className="max-w-xl w-full text-center space-y-8 animate-[fadeIn_0.6s_ease-out]">
        
        {/* Visual Asset Section: Floating 404 with bows/moños theme context if possible */}
        <div className="relative inline-block group">
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative">
            <h1 className="text-[12rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 tracking-tighter select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* SVG Icon: Bow or Moño simplified concept */}
                <div className="w-24 h-24 bg-white/40 backdrop-blur-sm rounded-2xl rotate-12 flex items-center justify-center p-4 border border-white/50 shadow-2xl">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-pink-500 fill-current animate-pulse">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 relative">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">¡Vaya! Se ha perdido el moño...</h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            Parece que la página que buscas no está en stock o ha cambiado su ubicación. No te preocupes, ¡tenemos mucho más para ver!
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transform active:scale-95 transition-all shadow-xl shadow-gray-200"
          >
            <FiHome className="text-lg" />
            Regresar al Inicio
          </Link>
          <button 
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transform active:scale-95 transition-all"
          >
            <FiTrendingUp className="text-lg text-pink-500" />
            Ver Novedades
          </button>
        </div>

        {/* Navigation Support Links */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60">
            <Link to="/contact" className="text-sm font-medium hover:text-gray-900 hover:underline">Soporte</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-gray-900 hover:underline">Blog</Link>
            <Link to="/profile" className="text-sm font-medium hover:text-gray-900 hover:underline">Mi Cuenta</Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
