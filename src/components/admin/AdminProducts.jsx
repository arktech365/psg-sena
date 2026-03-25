import React from 'react';
import Loader from '../Loader';
import { FiShoppingBag, FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

const AdminProducts = ({
  products,
  productsLoading,
  productSearchTerm,
  setProductSearchTerm,
  theme,
  formatCurrency,
  openAddProductModal,
  openEditProductModal,
  deleteProduct
}) => {
  if (productsLoading) {
    return <Loader text="Cargando productos..." size="lg" />;
  }

  const filteredProducts = productSearchTerm
    ? products.filter(product =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(productSearchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(productSearchTerm.toLowerCase()))
      )
    : products;

  const cardClass = `p-6 transition-all duration-300 backdrop-blur-md bg-white/80 shadow-xl border border-gray-100 rounded-3xl ${
    theme === 'dark' ? 'dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-2xl' : ''
  } w-full`;

  return (
    <div className={`${cardClass} animate-fadeIn`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
            Inventario de Productos
          </h2>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Administra tus productos, precios y disponibilidad
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
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
            onClick={openAddProductModal} 
            className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <FiPlus className="mr-2" size={18} />
            Añadir Nuevo
          </button>
        </div>
      </div>
      
      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-slate-700/50">
            <thead className={theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-gray-50/90 backdrop-blur-sm'}>
              <tr>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Producto</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Precio</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Stock</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-right uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-slate-700/40 bg-transparent' : 'hover:bg-blue-50/30 bg-transparent'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'} mr-4`}>
                        <FiShoppingBag className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={20} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.name}</div>
                        {product.category && <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{product.category}</div>}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${
                      product.stock > 10 
                        ? theme === 'dark' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200'
                        : product.stock > 0
                        ? theme === 'dark' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : theme === 'dark' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {product.stock} unds
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => openEditProductModal(product)} 
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:scale-110' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-110'
                        }`}
                        title="Editar producto"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id, product.name)} 
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110'
                        }`}
                        title="Eliminar producto"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <FiSearch size={32} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">
                {productSearchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </p>
              <p className="text-sm mt-1 opacity-70">
                {productSearchTerm ? 'Intenta usar otros términos de búsqueda' : 'Haz clic en "Añadir Nuevo" para empezar'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
