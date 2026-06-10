import React from 'react';
import { FiBook } from 'react-icons/fi';

const FloatingDocsButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[200] group flex items-center gap-3 p-4 bg-black text-white rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all duration-500 hover:-translate-y-2 active:scale-95"
      title="Ver Documentación"
    >
      <div className="relative">
        <FiBook size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-black group-hover:animate-ping"></span>
      </div>
      
      <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out">
        <span className="text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          Documentación
        </span>
      </div>
    </button>
  );
};

export default FloatingDocsButton;
