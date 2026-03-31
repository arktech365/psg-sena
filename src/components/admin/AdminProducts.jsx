import React from 'react';
import Loader from '../Loader';
import { FiShoppingBag, FiPlus, FiEdit3, FiTrash2, FiSearch, FiLayers, FiPackage, FiActivity, FiRefreshCw } from 'react-icons/fi';

const AdminProducts = ({
  products,
  productsLoading,
  productSearchTerm,
  setProductSearchTerm,
  theme,
  formatCurrency,
  openAddProductModal,
  openEditProductModal,
  deleteProduct,
  syncProductsToStripe,
  stripeSyncing
}) => {
  if (productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Sincronizando Inventario...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  const filteredProducts = productSearchTerm
    ? products.filter(product =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(productSearchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(productSearchTerm.toLowerCase()))
      )
    : products;

  // Luxury UI Tokens
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search Zone */}
      <div className={`${bgCard} p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Inventory Hub</span>
          </div>
          <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${textTitle}`}>Gestión de Productos</h2>
          <p className={`${textSub} mt-1 text-xs md:text-sm`}>Control total sobre tu catálogo, precios y niveles de stock.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <div className="relative w-full md:w-80 group">
            <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
            <input
              type="text"
              placeholder="Buscar..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900'
              }`}
            />
          </div>
          <button 
            onClick={openAddProductModal} 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm transition-all hover:bg-gray-800 hover:shadow-2xl active:scale-95 w-full md:w-auto"
          >
            <FiPlus size={20} /> Añadir Producto
          </button>
          <button 
            onClick={syncProductsToStripe}
            disabled={stripeSyncing}
            className={`flex items-center justify-center gap-2 px-8 py-4 ${isDark ? 'bg-indigo-600' : 'bg-emerald-600'} text-white rounded-2xl font-black text-sm transition-all hover:opacity-90 hover:shadow-2xl active:scale-95 w-full md:w-auto disabled:opacity-50`}
          >
            {stripeSyncing ? <FiRefreshCw className="animate-spin" /> : <FiActivity size={20} />}
            {stripeSyncing ? (stripeSyncing === "syncing" ? "Sincronizando..." : "Sincronizado!") : "Sincronizar Stripe"}
          </button>
        </div>
      </div>

      {/* Main Content Table / Cards */}
      <div className={`${bgCard} rounded-3xl md:rounded-[2.5rem] border overflow-hidden`}>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} border-b border-inherit`}>
                <th className="px-10 py-6">Detalle del Producto</th>
                <th className="px-10 py-6">Categoría</th>
                <th className="px-10 py-6">Inversión</th>
                <th className="px-10 py-6">Disponibilidad</th>
                <th className="px-10 py-6 text-right pr-14">Opciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="group hover:bg-indigo-500/5 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <FiShoppingBag className={textSub} size={24} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black text-base tracking-tight ${textTitle}`}>{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">#{p.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      <FiLayers size={10} /> {p.category || 'General'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`font-black text-base ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {formatCurrency(p.price)}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                      <span className={`text-sm font-bold ${textTitle}`}>{p.stock} <span className="opacity-40 font-medium">Uni.</span></span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right pr-14">
                    <div className="flex items-center justify-end gap-3 transition-opacity">
                      <button 
                        onClick={() => openEditProductModal(p)} 
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-indigo-400 hover:bg-slate-700' : 'bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                        title="Editar"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id, p.name)} 
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-rose-500/20' : 'bg-slate-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/10">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-6 space-y-4 hover:bg-indigo-500/5 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiShoppingBag className={textSub} size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-black text-lg block truncate tracking-tight ${textTitle}`}>{p.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {p.category || 'General'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">#{p.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Inversión</p>
                  <span className={`font-black text-lg ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {formatCurrency(p.price)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Disponibilidad</p>
                  <div className="flex items-center justify-end gap-2 text-sm font-bold">
                    <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                    <span className={textTitle}>{p.stock} Uni.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => openEditProductModal(p)} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}
                >
                  <FiEdit3 size={16} /> Editar
                </button>
                <button 
                  onClick={() => deleteProduct(p.id, p.name)} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800/50 text-rose-400' : 'bg-rose-50 text-rose-600'}`}
                >
                  <FiTrash2 size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <FiPackage size={32} className="opacity-20" />
            </div>
            <h3 className={`text-lg font-black ${textTitle}`}>Sin Resultados Coincidentes</h3>
            <p className={`${textSub} text-sm mt-2`}>Intenta refinar tus términos de búsqueda o añade un nuevo ejemplar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
