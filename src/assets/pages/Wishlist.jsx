import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

const Wishlist = () => {
  const { items, removeFromWishlist, loading } = useWishlist();

  const getPrimaryImageUrl = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const validImages = product.imageUrls.filter(img => img && (typeof img === 'string' || (img.data && typeof img.data === 'string')));
      if (validImages.length > 0) {
        const safeIndex = Math.min(product.primaryImageIndex || 0, validImages.length - 1);
        const primaryImage = validImages[safeIndex];
        if (typeof primaryImage === 'string') return primaryImage;
        if (primaryImage && primaryImage.data) return primaryImage.data;
      }
    }
    return product.imageUrl || 'https://via.placeholder.com/300x300.png?text=PSG';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Lista de Deseos</h1>
            <p className="mt-1 text-sm text-gray-500">
              {items.length > 0 ? `${items.length} producto${items.length !== 1 ? 's' : ''} guardado${items.length !== 1 ? 's' : ''}` : 'Tu lista está vacía'}
            </p>
          </div>
          {items.length > 0 && (
            <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-black transition-colors duration-150 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Agregar productos
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-gray-100 mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Tu lista de deseos está vacía</h3>
            <p className="mt-1 text-sm text-gray-500">Empieza a guardar productos que te gusten</p>
            <Link to="/shop" className="inline-flex items-center mt-6 px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-150">
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <Link to={`/product/${item.id}`}>
                  <div className="relative overflow-hidden aspect-square bg-gray-50">
                    <img
                      src={getPrimaryImageUrl(item)}
                      alt={item.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300.png?text=PSG'; }}
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <div className="mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{item.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">{item.name}</h3>

                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{item.rating}</span>
                    </div>
                  )}

                  <p className="text-base font-bold text-gray-900 mb-3">${parseFloat(item.price).toLocaleString('es-CO')}</p>

                  <div className="flex gap-2">
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-1 py-2 text-center text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-150"
                    >
                      Ver detalles
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex items-center justify-center w-9 h-9 text-gray-400 bg-white border border-gray-300 rounded-lg hover:border-red-300 hover:text-red-500 transition-all duration-150"
                      aria-label="Eliminar de favoritos"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;