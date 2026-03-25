import React from 'react';
import Loader from '../Loader';
import { FiList, FiPlus, FiEdit3, FiTrash2, FiSearch, FiLayers, FiImage } from 'react-icons/fi';

const AdminCategories = ({
  categories,
  categoriesLoading,
  categorySearchTerm,
  setCategorySearchTerm,
  theme,
  openAddCategoryModal,
  openEditCategoryModal,
  deleteCategoryHandler
}) => {
  if (categoriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Organizando Secciones...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  const filteredCategories = categorySearchTerm
    ? categories.filter(category =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(categorySearchTerm.toLowerCase()))
      )
    : categories;

  // Luxury UI Tokens
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search Zone */}
      <div className={`${bgCard} p-8 md:p-10 rounded-[2.5rem] border flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Structure Hub</span>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${textTitle}`}>Categorías de Marca</h2>
          <p className={`${textSub} mt-1 text-sm`}>Define la arquitectura de navegación y agrupamiento de tus productos.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <div className="relative w-full md:w-80 group">
            <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900'
              }`}
            />
          </div>
          <button 
            onClick={openAddCategoryModal} 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm transition-all hover:bg-gray-800 hover:shadow-2xl active:scale-95 w-full md:w-auto"
          >
            <FiPlus size={20} /> Nueva Categoría
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCategories.map((cat) => (
          <div 
            key={cat.id} 
            className={`${bgCard} group rounded-[2.5rem] border overflow-hidden transition-all duration-500 hover:-translate-y-2`}
          >
            <div className="relative h-60 w-full overflow-hidden">
              {cat.imageUrl ? (
                <img 
                  src={cat.imageUrl} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <FiImage className={textSub} size={40} opacity={0.2} />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={() => openEditCategoryModal(cat)} 
                  className="p-3 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-xl transition-all active:scale-90"
                  title="Editar"
                >
                  <FiEdit3 size={16} />
                </button>
                <button 
                  onClick={() => deleteCategoryHandler(cat.id, cat.name)} 
                  className="p-3 rounded-2xl bg-white text-rose-600 hover:bg-rose-600 hover:text-white shadow-xl transition-all active:scale-90"
                  title="Eliminar"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-0.5 bg-indigo-500 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Collection</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">{cat.name}</h3>
              </div>
            </div>
            
            <div className="p-8">
              <p className={`text-sm leading-relaxed line-clamp-2 ${textSub}`}>
                {cat.description || 'Sin descripción detallada para esta categoría.'}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <FiLayers className="text-indigo-500" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total: Dinámico</span>
              </div>
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <FiList size={32} className="opacity-20" />
            </div>
            <h3 className={`text-lg font-black ${textTitle}`}>Sin Resultados</h3>
            <p className={`${textSub} text-sm mt-2`}>No pudimos encontrar categorías que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
