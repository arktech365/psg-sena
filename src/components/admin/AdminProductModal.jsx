import React from 'react';
import { FiX } from 'react-icons/fi';

const AdminProductModal = ({
  isOpen,
  onClose,
  theme,
  modalMode,
  newProduct,
  editingProduct,
  categories,
  handleProductChange,
  handleEditProductChange,
  createProduct,
  updateProduct,
  handleImageSelect,
  uploading,
  removeImage,
  setPrimaryImage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn backdrop-blur-sm bg-black/40">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className={`z-50 inline-block overflow-hidden text-left align-bottom transition-all transform shadow-2xl rounded-3xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border ${
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'
        }`} style={{ width: '650px' }}>
          <div className="px-8 py-8">
            <div className="mb-8 text-center relative">
              <button 
                onClick={onClose}
                className={`absolute right-0 top-0 p-2 rounded-full transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FiX size={24} />
              </button>
              <h3 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
                {modalMode === 'add' ? 'Añadir Producto' : 'Editar Producto'}
              </h3>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {modalMode === 'add' ? 'Ingresa los detalles del nuevo producto' : 'Modifica la información del producto'}
              </p>
            </div>
            
            <div className="mt-2 text-left">
              <form onSubmit={modalMode === 'add' ? createProduct : updateProduct} className="space-y-6">
                <div>
                  <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nombre del Producto</label>
                  <input
                    type="text"
                    name="name"
                    value={modalMode === 'add' ? newProduct.name : editingProduct?.name}
                    onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                    className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Ej. Bolso de cuero elegante"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descripción</label>
                  <textarea
                    name="description"
                    value={modalMode === 'add' ? newProduct.description : editingProduct?.description}
                    onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                    className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                    rows="3"
                    placeholder="Describe los detalles, materiales y cuidado..."
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Precio (COP)</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      value={modalMode === 'add' ? newProduct.price : editingProduct?.price}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-emerald-500 ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white font-medium' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 font-medium'
                      }`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={modalMode === 'add' ? newProduct.stock : editingProduct?.stock}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      placeholder="Unidades disponibles"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Categoría</label>
                    <select
                      name="category"
                      value={modalMode === 'add' ? newProduct.category : editingProduct?.category}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Calificación Base</label>
                    <input
                      type="number"
                      name="rating"
                      step="0.1"
                      min="0"
                      max="5"
                      value={modalMode === 'add' ? newProduct.rating : editingProduct?.rating}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-yellow-500 ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      placeholder="0.0 - 5.0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Material</label>
                    <input
                      type="text"
                      name="material"
                      value={modalMode === 'add' ? newProduct.material : editingProduct?.material}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      placeholder="Ej. Cuero"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={modalMode === 'add' ? newProduct.color : editingProduct?.color}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      placeholder="Ej. Negro"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tamaño/Estilo</label>
                    <input
                      type="text"
                      name="style"
                      value={modalMode === 'add' ? newProduct.style : editingProduct?.style}
                      onChange={modalMode === 'add' ? handleProductChange : handleEditProductChange}
                      className={`w-full px-4 py-3 transition-all border-2 rounded-xl focus:ring-0 focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      placeholder="Ej. Mediano"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                  <label className={`block mb-2 text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Imágenes del Producto (Máx. 4)
                  </label>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => handleImageSelect(modalMode === 'edit')}
                      className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl transition-all shadow-sm w-full sm:w-auto ${
                        theme === 'dark' 
                          ? 'text-white bg-slate-800 border-2 border-slate-600 hover:border-blue-500 hover:bg-slate-700' 
                          : 'text-gray-700 bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      disabled={uploading || (modalMode === 'add' ? newProduct.imageUrls.length >= 4 : editingProduct?.imageUrls.length >= 4)}
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <div className={`w-5 h-5 mr-3 border-b-2 rounded-full animate-spin ${theme === 'dark' ? 'border-white' : 'border-gray-900'}`}></div>
                          Subiendo...
                        </div>
                      ) : (
                        `Seleccionar Imágenes ${modalMode === 'add' ? `(${newProduct.imageUrls.length}/4)` : `(${editingProduct?.imageUrls?.length || 0}/4)`}`
                      )}
                    </button>
                    
                    {modalMode === 'add' ? (
                      newProduct.imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                          {newProduct.imageUrls.map((imageData, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700">
                              <img 
                                src={typeof imageData === 'string' ? imageData : imageData.data} 
                                alt={`Preview ${index}`} 
                                className="object-cover w-full h-24 transform group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                              >
                                <FiX size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(index)}
                                className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
                                  newProduct.primaryImageIndex === index 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-gray-100 translate-y-2 group-hover:translate-y-0 transition-all'
                                }`}
                              >
                                {newProduct.primaryImageIndex === index ? 'Principal' : 'Fijar Principal'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      editingProduct?.imageUrls && editingProduct.imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                          {editingProduct.imageUrls.map((imageData, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700">
                              <img 
                                src={typeof imageData === 'string' ? imageData : imageData.data} 
                                alt={`Preview ${index}`} 
                                className="object-cover w-full h-24 transform group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                              >
                                <FiX size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(index, true)}
                                className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
                                  editingProduct.primaryImageIndex === index 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-gray-100 translate-y-2 group-hover:translate-y-0 transition-all'
                                }`}
                              >
                                {editingProduct.primaryImageIndex === index ? 'Principal' : 'Fijar Principal'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6 mt-8 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                      theme === 'dark' 
                        ? 'text-gray-300 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700' 
                        : 'text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 hover:shadow-blue-500/40 transition-all"
                  >
                    {modalMode === 'add' ? 'Guardar Producto' : 'Actualizar Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductModal;
