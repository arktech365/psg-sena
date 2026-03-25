import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import StarRating from '../../components/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

/* ─────────────────── Skeleton card ─────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-5 bg-gray-100 rounded w-1/4 mt-1" />
      <div className="h-9 bg-gray-100 rounded-xl mt-2" />
    </div>
  </div>
);

/* ─────────────────── Product Card ─────────────────── */
const ProductCard = ({ product, getPrimaryImageUrl, onAddToCart, onAddToWishlist }) => {
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(true);
    onAddToWishlist(product);
    setTimeout(() => setWishlisted(false), 2000);
  };

  const outOfStock = product.stock === 0;
  const lowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-50 flex-shrink-0">
        <img
          src={getPrimaryImageUrl(product)}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x400.png?text=PSG'; }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick-view label on hover */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow">
            Ver detalles →
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outOfStock && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-600 text-white shadow-sm">
              Agotado
            </span>
          )}
          {lowStock && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-white shadow-sm">
              Solo {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200
            ${wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
            }`}
          onClick={handleWishlist}
          aria-label="Agregar a favoritos"
        >
          <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4 4 0 000 6.364L12 20.364l7.682-7.682a4 4 0 00-6.364-6.364L12 7.636l-1.318-1.318a4 4 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">
          {product.category || 'General'}
        </span>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="mb-2">
            <StarRating rating={product.rating} size="sm" />
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-base font-extrabold text-gray-900 tracking-tight">
            ${parseFloat(product.price).toLocaleString('es-CO')}
          </span>
          <button
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150
              ${outOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95 shadow-sm hover:shadow'
              }`}
            disabled={outOfStock}
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          >
            {outOfStock ? (
              'Agotado'
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── Main Shop ─────────────────── */
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
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
        setError('No se pudieron cargar los productos. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);

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

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, filter, searchTerm, sortBy]);

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
    return product.imageUrl || 'https://via.placeholder.com/400x400.png?text=PSG';
  };

  const requireAuth = (action) => {
    if (!currentUser) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para continuar',
        icon: 'warning',
        confirmButtonText: 'Iniciar sesión',
        confirmButtonColor: '#111827',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then(result => { if (result.isConfirmed) window.location.href = '/psg-official/#/login'; });
      return false;
    }
    return true;
  };

  const handleAddToCart = (product) => {
    if (!requireAuth()) return;
    const stockLimit = product.stock !== undefined ? product.stock : Infinity;
    if (stockLimit === 0) {
      Swal.fire({ title: 'Producto agotado', text: 'Este producto no está disponible actualmente.', icon: 'error', confirmButtonColor: '#111827' });
      return;
    }
    addToCart({ ...product, imageUrl: getPrimaryImageUrl(product), quantity: 1 });
    Swal.fire({ title: '¡Agregado!', text: 'Producto agregado al carrito correctamente.', icon: 'success', confirmButtonColor: '#111827', timer: 1800, showConfirmButton: false });
  };

  const handleAddToWishlist = (product) => {
    if (!requireAuth()) return;
    addToWishlist({ ...product, imageUrl: getPrimaryImageUrl(product) });
    Swal.fire({ title: '¡Guardado!', text: 'Producto agregado a tu lista de deseos.', icon: 'success', confirmButtonColor: '#111827', timer: 1800, showConfirmButton: false });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-gray-50/50">
      <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Nuestra Colección</h1>
          <p className="mt-1 text-sm text-gray-500">
            {!loading && `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} disponible${filteredProducts.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* ── Filters bar ── */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                  ${filter === cat
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
              >
                {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Search + Sort row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative sm:w-72">
              <input
                type="text"
                id="product-search"
                placeholder="Buscar productos..."
                className="w-full py-2.5 pl-10 pr-9 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all cursor-pointer shadow-sm"
              >
                <option value="default">Orden predeterminado</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
                <option value="name">Nombre A–Z</option>
              </select>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M7 12h10M11 17h4" />
              </svg>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Active search tag */}
          {searchTerm && !loading && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-700">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? `No hay coincidencias para "${searchTerm}".` : 'No hay productos disponibles en esta categoría.'}
              </p>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setFilter('all'); setSortBy('default'); }}
              className="mt-1 inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getPrimaryImageUrl={getPrimaryImageUrl}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        )}

        {/* ── Bottom count ── */}
        {!loading && !error && filteredProducts.length > 0 && (
          <p className="mt-10 text-center text-xs text-gray-400">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        )}

      </div>
    </div>
  );
};

export default Shop;
