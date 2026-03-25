import { FiX, FiPlus, FiCamera, FiCheck, FiStar, FiLayers, FiType, FiMic, FiBox, FiDollarSign, FiRefreshCw } from 'react-icons/fi';

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

  const isDark = theme === 'dark';
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const modalOverlay = isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-slate-900/40 backdrop-blur-md';

  const productData = modalMode === 'add' ? newProduct : editingProduct;
  const onChange = modalMode === 'add' ? handleProductChange : handleEditProductChange;

  return (
    <div className={`flex fixed inset-0 justify-center items-center p-4 duration-300 z-[200] md:p-6 ${modalOverlay} animate-in fade-in`}>
      <div 
        className={`w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2rem] md:rounded-[2.5rem] border shadow-2xl relative animate-in zoom-in-95 duration-300 ${bgCard}`}
      >
        <div className="relative p-6 md:p-12">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className={`absolute right-4 md:right-8 top-4 md:top-8 p-3 rounded-2xl transition-all active:scale-95 z-10 ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <FiX size={18} className="md:w-5 md:h-5" />
          </button>

          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex gap-3 items-center mb-2">
              <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Catalogue Engineering</span>
            </div>
            <h3 className={`text-xl md:text-4xl font-black tracking-tight ${textTitle}`}>
              {modalMode === 'add' ? 'Nuevo Ejemplar' : 'Editar Producto'}
            </h3>
            <p className={`mt-1 text-xs md:text-base ${textSub}`}>Define los parámetros técnicos y estéticos de tu producto.</p>
          </div>

          <form onSubmit={modalMode === 'add' ? createProduct : updateProduct} className="space-y-8 md:space-y-10">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-6 md:space-y-8 md:col-span-2">
                <div className="space-y-3">
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Nombre de Identidad</label>
                  <div className="relative group">
                    <FiType className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                    <input
                      type="text"
                      name="name"
                      value={productData?.name}
                      onChange={onChange}
                      className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                        isDark ? 'text-white bg-slate-900 border-slate-700 focus:ring-indigo-500/10' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/5 text-slate-900'
                      }`}
                      placeholder="Ej: Bolso Luxury Edition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Narrativa del Producto</label>
                  <textarea
                    name="description"
                    value={productData?.description}
                    onChange={onChange}
                    rows="4"
                    className={`w-full px-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                      isDark ? 'text-white bg-slate-900 border-slate-700 focus:ring-indigo-500/10' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/5 text-slate-900'
                    }`}
                    placeholder="Detalla los materiales, el origen y la propuesta de valor..."
                  />
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Inversión (COP)</label>
                  <div className="relative group">
                    <FiDollarSign className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
                    <input
                      type="number"
                      name="price"
                      value={productData?.price}
                      onChange={onChange}
                      className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                        isDark ? 'font-bold text-white bg-slate-900 border-slate-700 focus:ring-emerald-500/10' : 'font-bold bg-slate-50 border-slate-200 focus:ring-emerald-500/5 text-slate-900'
                      }`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Existencias</label>
                  <div className="relative group">
                    <FiBox className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-400' : 'text-slate-400 group-focus-within:text-amber-600'}`} />
                    <input
                      type="number"
                      name="stock"
                      value={productData?.stock}
                      onChange={onChange}
                      className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                        isDark ? 'text-white bg-slate-900 border-slate-700 focus:ring-amber-500/10' : 'bg-slate-50 border-slate-200 focus:ring-amber-500/5 text-slate-900'
                      }`}
                      placeholder="Unidades"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Categoría</label>
                <select
                  name="category"
                  value={productData?.category}
                  onChange={onChange}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold text-xs uppercase tracking-widest ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="">Clasificación</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Valoración Base</label>
                <div className="relative group">
                  <FiStar className={`absolute left-5 top-1/2 text-amber-500 -translate-y-1/2`} />
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={productData?.rating}
                    onChange={onChange}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all outline-none ${
                        isDark ? 'text-white bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="0.0 - 5.0"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Material</label>
                <input
                  type="text"
                  name="material"
                  value={productData?.material}
                  onChange={onChange}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none ${
                      isDark ? 'text-white bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ej: Cuero Italiano"
                />
              </div>

              <div className="space-y-3">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Color / Estilo</label>
                <input
                  type="text"
                  name="color"
                  value={productData?.color}
                  onChange={onChange}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none ${
                      isDark ? 'text-white bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="Ej: Midnight Blue"
                />
              </div>
            </div>

            {/* Media System */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Gestión de Assets Visuales (Máx 4)</label>
                <button
                  type="button"
                  onClick={() => handleImageSelect(modalMode === 'edit')}
                  disabled={uploading || (productData?.imageUrls?.length >= 4)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl border-2 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest ${
                    isDark 
                    ? 'text-indigo-400 border-indigo-600/30 hover:bg-indigo-600 hover:text-white' 
                    : 'text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {uploading ? <FiRefreshCw className="animate-spin" /> : <FiCamera size={14} className="md:w-4 md:h-4" />}
                  {uploading ? '...' : 'Cargar Assets'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-4">
                {productData?.imageUrls?.map((img, idx) => (
                  <div key={idx} className={`relative rounded-2xl md:rounded-3xl overflow-hidden border-2 group transition-all duration-300 ${isDark ? 'border-slate-800' : 'border-slate-100'} h-32 md:h-40`}>
                    <img 
                      src={typeof img === 'string' ? img : img.data} 
                      alt="Product" 
                      className="object-cover w-full h-full transition-transform group-hover:scale-110"
                    />
                    <div className="flex absolute inset-0 flex-col gap-2 justify-center items-center opacity-0 transition-opacity bg-black/60 group-hover:opacity-100">
                       <button 
                         type="button" 
                         onClick={() => setPrimaryImage(idx, modalMode === 'edit')}
                         className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            productData.primaryImageIndex === idx ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-indigo-600 hover:text-white'
                         }`}
                       >
                         {productData.primaryImageIndex === idx ? <FiCheck className="inline-block mr-1"/> : null}
                         {productData.primaryImageIndex === idx ? 'Principal' : 'Fijar Portada'}
                       </button>
                       <button 
                         type="button" 
                         onClick={() => removeImage(idx, modalMode === 'edit')}
                         className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-rose-600 text-white hover:bg-rose-700 transition-all"
                       >
                         Eliminar
                       </button>
                    </div>
                  </div>
                ))}
                {[...Array(Math.max(0, 4 - (productData?.imageUrls?.length || 0)))].map((_, i) => (
                  <div key={i} className={`rounded-2xl md:rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 h-32 md:h-40 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50'}`}>
                    <FiLayers className="text-slate-300 md:w-6 md:h-6" size={20} />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Viento</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-6 md:pt-8">
              <button
                type="button"
                onClick={onClose}
                className={`order-2 md:order-1 flex-1 py-4 md:py-5 rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest transition-all ${
                  isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`order-1 md:order-2 flex-[2] py-4 md:py-5 ${isDark ? 'bg-indigo-600' : 'bg-black'} text-white rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest transition-all hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98]`}
              >
                {modalMode === 'add' ? 'Lanzar al Mercado' : 'Actualizar Ejemplar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductModal;
