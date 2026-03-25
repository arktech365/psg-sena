import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import StarRating from '../../components/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await getProducts();
        setProducts(productList);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = filter === 'all' ? products : products.filter(p => p.category === filter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.material && p.material.toLowerCase().includes(term)) ||
        (p.color && p.color.toLowerCase().includes(term))
      );
    }
    return result;
  }, [products, filter, searchTerm]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const getPrimaryImageUrl = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const validImages = product.imageUrls.filter(img => img && (typeof img === 'string' || (img.data && typeof img.data === 'string')));
      if (validImages.length > 0) {
        const safeIndex = Math.min(product.primaryImageIndex || 0, validImages.length - 1);
        const img = validImages[safeIndex];
        if (typeof img === 'string') return img;
        if (img && img.data) return img.data;
      }
    }
    return product.imageUrl || 'https://via.placeholder.com/300x300.png?text=PSG';
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      Swal.fire({ title: 'Inicia sesión', text: 'Debes iniciar sesión para agregar productos al carrito', icon: 'warning', confirmButtonText: 'Iniciar sesión', showCancelButton: true, cancelButtonText: 'Cancelar' }).then(result => { if (result.isConfirmed) window.location.href = '/psg-shop/#/login'; });
      return;
    }
    const stockLimit = product.stock !== undefined ? product.stock : Infinity;
    if (stockLimit === 0) { Swal.fire({ title: 'Producto agotado', text: 'Este producto no está disponible actualmente.', icon: 'error', confirmButtonText: 'Aceptar' }); return; }
    addToCart({ ...product, imageUrl: getPrimaryImageUrl(product), quantity: 1 });
    Swal.fire({ title: 'Producto agregado', text: 'Producto agregado correctamente al carrito', icon: 'success', confirmButtonText: 'Aceptar' });
  };

  const handleAddToWishlist = (product) => {
    if (!currentUser) {
      Swal.fire({ title: 'Inicia sesión', text: 'Debes iniciar sesión para agregar productos a tu lista de deseos', icon: 'warning', confirmButtonText: 'Iniciar sesión', showCancelButton: true, cancelButtonText: 'Cancelar' }).then(result => { if (result.isConfirmed) window.location.href = '/psg-shop/#/login'; });
      return;
    }
    addToWishlist({ ...product, imageUrl: getPrimaryImageUrl(product) });
    Swal.fire({ title: 'Producto agregado', text: 'Producto agregado correctamente a tu lista de deseos', icon: 'success', confirmButtonText: 'Aceptar' });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Nuestra Colección</h1>
            <p className="mt-1 text-sm text-gray-500">
              {!loading && `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} disponible${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:w-64 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Filter */}
            <div className="relative">
              <select
                id="category-filter"
                className="appearance-none py-2.5 pl-4 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas las categorías' : (typeof cat === 'string' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat)}
                  </option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active search info */}
        {searchTerm && !loading && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">{filteredProducts.length} resultado(s) para</span>
            <span className="text-sm font-medium text-gray-900">"{searchTerm}"</span>
            <button onClick={() => setSearchTerm('')} className="ml-1 text-xs text-gray-400 hover:text-gray-700 underline">Limpiar</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Cargando productos...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-900">No se encontraron productos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No hay coincidencias para "${searchTerm}".` : 'No hay productos disponibles en esta categoría.'}
            </p>
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setFilter('all'); }} className="mt-5 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden aspect-square bg-gray-50">
                    <img
                      src={getPrimaryImageUrl(product)}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300.png?text=PSG'; }}
                    />
                    {/* Stock badge */}
                    {product.stock !== undefined && product.stock <= 5 && (
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {product.stock > 0 ? `Solo ${product.stock}` : 'Agotado'}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{product.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">{product.name}</h3>
                  {product.rating > 0 && (
                    <div className="mb-2">
                      <StarRating rating={product.rating} size="sm" />
                    </div>
                  )}
                  <p className="text-base font-bold text-gray-900 mb-3">${parseFloat(product.price).toLocaleString('es-CO')}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-150 disabled:opacity-40"
                      disabled={product.stock === 0}
                      onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                    >
                      {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                    </button>
                    <button
                      className="flex items-center justify-center w-9 h-9 text-gray-500 bg-white border border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all duration-150"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToWishlist(product); }}
                      aria-label="Agregar a favoritos"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4 4 0 000 6.364L12 20.364l7.682-7.682a4 4 0 00-6.364-6.364L12 7.636l-1.318-1.318a4 4 0 00-6.364 0z" />
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

export default Shop;