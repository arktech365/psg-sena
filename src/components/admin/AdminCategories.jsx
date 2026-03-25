import React from 'react';
import Loader from '../Loader';
import { FiList, FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

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
    return <Loader text="Cargando categorías..." size="lg" />;
  }

  const filteredCategories = categorySearchTerm
    ? categories.filter(category =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(categorySearchTerm.toLowerCase()))
      )
    : categories;

  const cardClass = `p-6 transition-all duration-300 backdrop-blur-md bg-white/80 shadow-xl border border-gray-100 rounded-3xl ${
    theme === 'dark' ? 'dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-2xl' : ''
  } w-full`;

  return (
    <div className={`${cardClass} animate-fadeIn`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
            Categorías de Productos
          </h2>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Organiza tu inventario
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700 text-white placeholder-gray-500 focus:bg-slate-800' 
                  : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
              }`}
            />
            <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
            }`} size={18} />
          </div>
          <button 
            onClick={openAddCategoryModal} 
            className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <FiPlus className="mr-2" size={18} />
            Añadir Nueva
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div 
            key={category.id} 
            className={`group flex flex-col rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
              theme === 'dark' 
                ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50 shadow-lg' 
                : 'bg-white border-gray-100 hover:border-blue-200 shadow-md'
            }`}
          >
            <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
              {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className={`flex items-center justify-center w-full h-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <FiList className={`w-12 h-12 opacity-30 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button 
                  onClick={() => openEditCategoryModal(category)} 
                  className="p-2 rounded-full bg-white/90 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-md transition-colors"
                  title="Editar"
                >
                  <FiEdit size={14} />
                </button>
                <button 
                  onClick={() => deleteCategoryHandler(category.id, category.name)} 
                  className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white shadow-md transition-colors"
                  title="Eliminar"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
                {category.name}
              </h3>
              <p className={`text-sm flex-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} line-clamp-3`}>
                {category.description || 'Sin descripción disponible'}
              </p>
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className={`col-span-full flex flex-col items-center justify-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <FiList size={32} className="opacity-50" />
            </div>
            <p className="text-lg font-medium">
              {categorySearchTerm ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
