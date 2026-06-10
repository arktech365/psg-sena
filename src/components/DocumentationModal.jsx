import React, { useEffect, useRef } from 'react';
import { FiDownload, FiFileText, FiSettings, FiUsers, FiBook, FiX } from 'react-icons/fi';

// Importación de los archivos PDF
import manualInstalacion from '../assets/sources/manualinstalacion.pdf';
import manualUsuario from '../assets/sources/ManualUsuario.pdf';
import manualTecnico from '../assets/sources/ManualTecnico.pdf';
import planCapacitacion from '../assets/sources/PlanCapacitación.pdf';

const DocumentationModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const docs = [
    { 
      title: "Manual de Instalación", 
      desc: "Guía de configuración y despliegue del sistema", 
      file: manualInstalacion, 
      icon: <FiSettings className="text-blue-500" />
    },
    { 
      title: "Manual de Usuario", 
      desc: "Instrucciones de uso para clientes y visitantes", 
      file: manualUsuario, 
      icon: <FiBook className="text-emerald-500" />
    },
    { 
      title: "Manual Técnico", 
      desc: "Arquitectura, base de datos y lógica del código", 
      file: manualTecnico, 
      icon: <FiFileText className="text-indigo-500" />
    },
    { 
      title: "Plan de Capacitación", 
      desc: "Plan de formación para los usuarios finales", 
      file: planCapacitacion, 
      icon: <FiUsers className="text-purple-500" />
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-7 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black tracking-tight text-gray-900">Documentación</h3>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">Recursos del Proyecto</p>
          </div>
          <button 
            onClick={onClose} 
            className="flex justify-center items-center w-10 h-10 rounded-full transition-all hover:bg-gray-200 active:scale-90"
          >
            <FiX size={20} className="text-gray-400" />
          </button>
        </div>

        {/* List of Manuals */}
        <div className="p-6 space-y-3">
          {docs.map((doc, idx) => (
            <a
              key={idx}
              href={doc.file}
              download={`${doc.title}.pdf`}
              className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100 transition-all hover:border-black hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="flex gap-4 items-center">
                <div className="flex justify-center items-center w-14 h-14 text-2xl bg-gray-50 rounded-2xl transition-colors group-hover:bg-gray-100">
                  {doc.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight text-gray-900">{doc.title}</h4>
                  <p className="text-[11px] text-gray-400 font-medium leading-tight">{doc.desc}</p>
                </div>
              </div>
              <div className="flex justify-center items-center w-10 h-10 text-gray-400 bg-gray-50 rounded-full shadow-inner transition-all group-hover:bg-black group-hover:text-white">
                <FiDownload size={16} />
              </div>
            </a>
          ))}
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center px-8 py-5 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">PSG SHOP</span>
          </div>
          <span className="text-[9px] font-medium text-gray-300 uppercase tracking-widest">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
