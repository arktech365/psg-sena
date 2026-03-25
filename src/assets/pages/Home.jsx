import React, { useState, useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import StarRating from '../../components/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

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

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { currentUser } = useAuth();

  // State for testimonials slider
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Refs for touch events
  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const endXRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Formspree form setup
  const [state, handleSubmit] = useForm("mpwybkly");
  
  // State for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        setLoading(true);
        const productList = await getProducts();
        // Get top 8 products with highest ratings or randomly select if no ratings
        const sortedProducts = [...productList]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
        setFeaturedProducts(sortedProducts);
        
        // Fetch categories
        setCategoriesLoading(true);
        const categoriesList = await getCategories();
        setCategoryList(categoriesList);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  // Testimonials data - Potenciado con más detalles
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Cliente Verificada",
      title: "¡Calidad insuperable!",
      text: "Los moños son de excelente calidad y el envío fue increíblemente rápido. Cada detalle está cuidado con amor. ¡Definitivamente volveré a comprar!",
      rating: 5,
      date: "Hace 2 semanas"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Padre Satisfecho",
      title: "Excelente para regalos",
      text: "Compré un set para mi hija y quedó encantada. La atención al cliente es personalizada y muy humana. Muy recomendado para ocasiones especiales.",
      rating: 5,
      date: "Hace 1 mes"
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Estilista Profesional",
      title: "Diseños únicos",
      text: "Como estilista, busco accesorios que destaquen. Estos moños tienen diseños que no se encuentran en tiendas convencionales. La tela es premium.",
      rating: 5,
      date: "Hace 3 días"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get the primary image URL for a product
  const getPrimaryImageUrl = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      // Filter out empty images
      const validImages = product.imageUrls.filter(image => 
        image && (typeof image === 'string' || (image.data && typeof image.data === 'string'))
      );
      if (validImages.length > 0) {
        const primaryIndex = product.primaryImageIndex || 0;
        // Ensure primaryIndex is within bounds
        const safeIndex = Math.min(primaryIndex, validImages.length - 1);
        const primaryImage = validImages[safeIndex];
        
        // Handle both string URLs and base64 data objects
        if (typeof primaryImage === 'string') {
          return primaryImage;
        } else if (primaryImage && primaryImage.data) {
          return primaryImage.data;
        }
      }
    }
    return product.imageUrl || 'https://via.placeholder.com/300x300.png?text=Moño';
  };

  // Function to handle adding to cart with authentication check
  const handleAddToCart = (product) => {
    // Check if user is logged in
    if (!currentUser) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos al carrito',
        icon: 'warning',
        confirmButtonText: 'Iniciar sesión',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page with hash routing
          window.location.href = '/psg-shop/#/login';
        }
      });
      return;
    }

    // Check if product has stock
    const stockLimit = product.stock !== undefined ? product.stock : Infinity;
    if (stockLimit === 0) {
      Swal.fire({
        title: 'Producto agotado',
        text: 'Este producto no está disponible actualmente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    // Get the primary product image as selected in the admin panel
    const mainImage = getPrimaryImageUrl(product);
    
    addToCart({
      ...product,
      imageUrl: mainImage, // Ensure we use the primary image selected in admin panel
      quantity: 1
    });
    
    Swal.fire({
      title: 'Producto agregado',
      text: 'Producto agregado correctamente al carrito',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  };

  // Function to handle adding to wishlist with authentication check
  const handleAddToWishlist = (product) => {
    // Check if user is logged in
    if (!currentUser) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos a tu lista de deseos',
        icon: 'warning',
        confirmButtonText: 'Iniciar sesión',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page with hash routing
          window.location.href = '/psg-shop/#/login';
        }
      });
      return;
    }

    // Get the primary product image as selected in the admin panel
    const mainImage = getPrimaryImageUrl(product);
    
    addToWishlist({
      ...product,
      imageUrl: mainImage // Ensure we use the primary image selected in admin panel
    });
    
    Swal.fire({
      title: 'Producto agregado',
      text: 'Producto agregado correctamente a tu lista de deseos',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  };

  // Features data
  const features = [
    {
      id: 1,
      title: "Envío Gratis",
      description: "En pedidos superiores a $100.000 COP",
      icon: (
        <svg className="w-8 h-8 text-black uppercase tracking-widest" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: "Devolución Gratuita",
      description: "30 días para devoluciones sin complicaciones",
      icon: (
        <svg className="w-8 h-8 text-black uppercase tracking-widest" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "Soporte 24/7",
      description: "Asistencia dedicada en cualquier momento",
      icon: (
        <svg className="w-8 h-8 text-black uppercase tracking-widest" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: "Pago Seguro",
      description: "Protegemos tus datos de pago",
      icon: (
        <svg className="w-8 h-8 text-black uppercase tracking-widest" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 11-8 0v4h8z"></path>
        </svg>
      )
    }
  ];



  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    endXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    const swipeThreshold = 50;
    
    if (startXRef.current - endXRef.current > swipeThreshold) {
      // Swipe left - next testimonial
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    } else if (endXRef.current - startXRef.current > swipeThreshold) {
      // Swipe right - previous testimonial
      setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
    
    // Reset values
    startXRef.current = 0;
    endXRef.current = 0;
  };
  
  // Handle mouse events for desktop drag
  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    endXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    const swipeThreshold = 50;
    
    if (startXRef.current - endXRef.current > swipeThreshold) {
      // Swipe left - next testimonial
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    } else if (endXRef.current - startXRef.current > swipeThreshold) {
      // Swipe right - previous testimonial
      setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
    
    // Reset values
    startXRef.current = 0;
    endXRef.current = 0;
  };
  
  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Restored Original Layout, Maximized Aesthetic */}
      <section className="flex flex-col gap-8 p-6 mx-auto lg:flex-row max-w-7xl animate-fade-in">
        {/* Bloque principal - Enhanced Original */}
        <div className="flex flex-col md:flex-row items-center justify-between flex-1 p-10 md:p-16 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-50/50 group relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-md">
            {/* Etiqueta superior mejorada */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 text-[10px] font-bold tracking-widest text-indigo-600 bg-white border border-indigo-100 rounded-full shadow-sm">
                NUEVO
              </span>
              <span className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold text-gray-500 rounded-full bg-white/80 border border-gray-100 shadow-sm">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Envío gratis hoy!
              </span>
            </div>

            {/* Título Premium */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl tracking-tighter">
              Elegancia en <br />
              cada <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">detalle</span> perfecto
            </h1>

            {/* Descripción */}
            <p className="mb-10 text-lg text-gray-500 leading-relaxed font-medium">
              Colección exclusiva de moños artesanales. Calidad premium, diseño único y entrega inmediata.
            </p>

            {/* Botón Mejorado */}
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-widest text-white transition-all bg-black rounded-2xl hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95 group/btn"
            >
              VER CATÁLOGO
              <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Imagen principal mejorada */}
          <div className="mt-12 md:mt-0 relative group-hover:rotate-1 transition-transform duration-700">
            <div className="absolute inset-0 bg-indigo-500 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <img
              src="/psg-shop/mejores.jpg"
              alt="Elegante colección"
              className="relative object-cover w-64 md:w-80 h-auto rounded-[2rem] shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x600.png?text=Elegante+Colecci%C3%B3n';
              }}
            />
          </div>
        </div>

        {/* Panel lateral derecho - Enhanced Original Cards */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          {/* Tarjeta 1: Mejores Moños */}
          <div className="group flex items-center justify-between flex-1 p-8 bg-indigo-50/50 border border-indigo-100/50 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
            
            <div className="flex-1 relative z-10">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 leading-tight">
                Mejores <span className="text-indigo-600">moños</span>
              </h3>
              <p className="mb-6 text-sm text-gray-500 font-medium">
                Selección artesanal premium.
              </p>
              <Link to="/shop" className="inline-flex items-center gap-2 group/link text-xs font-bold uppercase tracking-widest text-gray-900">
                Ver más
                <span className="w-8 h-px bg-gray-200 group-hover/link:w-12 transition-all duration-500" />
              </Link>
            </div>
            <img
              src="/psg-shop/counteer.jpg"
              alt="Moño"
              className="object-contain w-24 h-24 ml-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/100x100.png?text=Moño';
              }}
            />
          </div>

          {/* Tarjeta 2: Descuento */}
          <div className="group flex items-center justify-between flex-1 p-8 bg-purple-50/50 border border-purple-100/50 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
            
            <div className="flex-1 relative z-10">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 leading-tight">
                <span className="text-purple-600">20%</span> Descuento
              </h3>
              <p className="mb-6 text-sm text-gray-500 font-medium">
                Colección especial limitada.
              </p>
              <Link to="/shop" className="inline-flex items-center gap-2 group/link text-xs font-bold uppercase tracking-widest text-gray-900">
                Ver más
                <span className="w-8 h-px bg-gray-200 group-hover/link:w-12 transition-all duration-500" />
              </Link>
            </div>
            <img
              src="/psg-shop/discount.jpg"
              alt="Oferta"
              className="object-contain w-24 h-24 ml-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/100x100.png?text=Oferta';
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Refined for Minimalist Premium Look */}
      <div className="relative py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 border-y border-gray-100 py-12">
            <div className="text-center md:border-r border-gray-50 last:border-0 px-4">
              <div className="text-4xl font-bold text-gray-900 tracking-tighter mb-1">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Clientes Reales</div>
            </div>
            <div className="text-center md:border-r border-gray-50 last:border-0 px-4">
              <div className="text-4xl font-bold text-gray-900 tracking-tighter mb-1">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Artesanal</div>
            </div>
            <div className="text-center md:border-r border-gray-50 last:border-0 px-4">
              <div className="text-4xl font-bold text-gray-900 tracking-tighter mb-1">24h</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Envío Rápido</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-gray-900 tracking-tighter mb-1">5.0</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Enhanced with better spacing and design */}
      <div className="py-16 bg-white  border border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 lg:text-center">
            <h2 className="text-base font-semibold tracking-widest text-black uppercase">Nuestros Beneficios</h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Por qué elegirnos
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Comprometidos con la calidad y la satisfacción del cliente
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.id} className="text-center group">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto transition-all duration-300 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/100/10 border border-gray-200">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Enhanced with gradient overlays and better design */}
      {/* Categories Section - Premium Design */}
      <div className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="mb-2 text-xs font-bold tracking-widest text-indigo-500 uppercase">Colecciones</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Nuestras Categorías
            </h2>
            <div className="w-12 h-1 mt-4 bg-black rounded-full" />
          </div>

          <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {categoryList.length > 0 ? (
              categoryList.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="relative flex flex-col justify-end w-full overflow-hidden transition-transform duration-500 transform bg-gray-100 group h-96 rounded-2xl hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Category Image */}
                  <img
                    src={category.imageUrl || '/psg-shop/clasicos.jpg'}
                    alt={category.name}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/500x500.png?text=' + encodeURIComponent(category.name);
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-80 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:opacity-100"></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-start p-6 transition-transform duration-500 transform translate-y-4 md:p-8 group-hover:translate-y-0">
                    <h3 className="mb-1 text-2xl font-bold tracking-tight text-white capitalize">{category.name}</h3>
                    <div className="w-0 h-0.5 bg-white mb-3 transition-all duration-500 group-hover:w-8" />
                    <span className="inline-flex items-center text-xs font-semibold tracking-widest text-white/80 uppercase transition-colors duration-300 group-hover:text-white">
                      Explorar 
                      <svg className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))
            ) : categoriesLoading ? (
              <div className="flex items-center justify-center w-full h-64 col-span-4">
                <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full col-span-4 py-16 bg-gray-50 rounded-2xl">
                <div className="mb-4 text-5xl">📁</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">No hay categorías</h3>
                <p className="mb-6 text-gray-500">Actualmente no hay categorías disponibles en la tienda.</p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white transition-all bg-black rounded-lg hover:bg-gray-800"
                >
                  Explorar productos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products Section - Enhanced with better card design */}
      <div className="py-16 bg-white  border border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 lg:text-center">
            <h2 className="text-base font-semibold tracking-wide text-black uppercase tracking-widest uppercase">Productos Destacados</h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Lo más vendido
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
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

          <div className="mt-16 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 text-base font-medium text-gray-900 transition-all duration-300 border border-transparent rounded-lg shadow-2xl shadow-sm bg-black text-white hover:from-indigo-400 hover:to-purple-500 hover:shadow-xl"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Premium Aesthetic Redesign */}
      <section className="relative py-24 overflow-hidden bg-gray-50/50">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-100 rounded-full">
              Testimonios
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Lo que dicen de nosotros
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-500">
              Nuestra mayor satisfacción es ver a nuestros clientes felices con sus accesorios únicos.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Quote Icon Background */}
            <div className="absolute top-0 left-0 -translate-x-6 -translate-y-8 opacity-10">
              <svg width="120" height="95" viewBox="0 0 120 95" fill="none" className="text-gray-900">
                <path d="M34.2857 0C15.3524 0 0 15.3524 0 34.2857V94.2857H60V34.2857H25.7143C25.7143 25.7143 31.2857 20.1429 39.8571 20.1429L34.2857 0ZM94.2857 0C75.3524 0 60 15.3524 60 34.2857V94.2857H120V34.2857H85.7143C85.7143 25.7143 91.2857 20.1429 99.8571 20.1429L94.2857 0Z" fill="currentColor"/>
              </svg>
            </div>

            {/* Slider Container */}
            <div className="relative z-10 overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {testimonials.map((t) => (
                  <div key={t.id} className="flex-shrink-0 w-full p-2">
                    <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-3xl p-8 md:p-12">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        {/* Avatar & Info */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
                          <div className="relative mb-4 group">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=111827&color=ffffff&size=128&bold=true`}
                              alt={t.name}
                              className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1.5 border-2 border-white shadow-md">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-2">{t.role}</p>
                          <div className="flex gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-gray-900 mb-4">"{t.title}"</h4>
                          <p className="text-lg text-gray-600 leading-relaxed italic mb-6">
                            {t.text}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 self-start px-3 py-1 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Publicado {t.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-10">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'w-8 bg-indigo-600 shadow-sm' : 'w-2 bg-indigo-200 hover:bg-indigo-300'
                    }`}
                    aria-label={`Ir al testimonio ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                  className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 hover:shadow-lg transition-all active:scale-95 shadow-indigo-200 shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section - Editorial Design */}
      <section className="py-24 bg-gray-50/30">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full">
                Nuestra Esencia
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Artesanía que cuenta <br /> una <span className="text-indigo-600">historia</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-gray-500 leading-relaxed font-medium">
              Desde 2015, transformamos telas premium en accesorios que celebran los momentos más especiales de tu vida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1: Historia */}
            <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src="/psg-shop/trayectoria.jpg" 
                  alt="Nuestra Trayectoria" 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-4 left-4 inline-flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-indigo-600/90 backdrop-blur-md rounded-full">
                  Desde 2015
                </span>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Trayectoria</h3>
                <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                  Nacimos como un sueño artesanal y hoy somos referentes de elegancia en cada accesorio de moda que creamos.
                </p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors group/link"
                >
                  Descubrir más
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 2: Valores */}
            <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src="/psg-shop/compromiso.jpg" 
                  alt="Compromiso" 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-4 left-4 inline-flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-purple-600/90 backdrop-blur-md rounded-full">
                  Hecho a Mano
                </span>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Calidad sin Compromiso</h3>
                <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                  Utilizamos solo materiales premium y técnicas milenarias para asegurar que cada pieza sea una obra de arte.
                </p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-purple-600 hover:text-purple-700 transition-colors group/link"
                >
                  Nuestros procesos
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 3: Equipo */}
            <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src="/psg-shop/calidad.jpg" 
                  alt="Equipo" 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-4 left-4 inline-flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-gray-900/90 backdrop-blur-md rounded-full">
                  Talento Local
                </span>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Corazón de Artesano</h3>
                <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                  Detrás de cada moño hay un equipo apasionado que pone su alma en cada costura y cada detalle.
                </p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-black transition-colors group/link"
                >
                  Conoce al equipo
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black hover:shadow-2xl hover:shadow-gray-200 transition-all active:scale-95 group"
            >
              Nuestra Historia Completa
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section - Premium Redesign */}
      <section className="py-24 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Side: Info */}
            <div className="lg:w-1/3">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                Contacto
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                Hablemos de tu próximo moño favorito
              </h2>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                ¿Tienes una idea especial o necesitas ayuda con tu pedido? Estamos aquí para escucharte y asesorarte.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Escríbenos</h4>
                    <p className="text-gray-500 font-medium">contacto@psgshop.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Llámanos</h4>
                    <p className="text-gray-500 font-medium">+57 (300) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Visítanos</h4>
                    <p className="text-gray-500 font-medium">Bucaramanga, Santander, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-2/3">
              <div className="bg-gray-50/50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/10 transition-colors duration-700" />
                
                {state.succeeded ? (
                  <div className="text-center py-12 relative z-10">
                    <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje enviado con éxito!</h3>
                    <p className="text-gray-500 mb-8">Gracias por contactarnos. Te responderemos en menos de 24 horas.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    <div className="grid grid-cols-1 md:gap-8 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          autoComplete="name"
                          className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-transparent shadow-sm focus:border-indigo-600 focus:ring-0 transition-all outline-none text-gray-900 placeholder:text-gray-300 font-medium"
                          placeholder="Ej. María Pérez"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          autoComplete="email"
                          className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-transparent shadow-sm focus:border-indigo-600 focus:ring-0 transition-all outline-none text-gray-900 placeholder:text-gray-300 font-medium"
                          placeholder="tu@correo.com"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-500 mt-1 ml-1" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        Asunto
                      </label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-transparent shadow-sm focus:border-indigo-600 focus:ring-0 transition-all outline-none text-gray-900 placeholder:text-gray-300 font-medium"
                        placeholder="Ej. Pedido personalizado"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        Tu Mensaje
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-transparent shadow-sm focus:border-indigo-600 focus:ring-0 transition-all outline-none text-gray-900 placeholder:text-gray-300 font-medium resize-none"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                      />
                      <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-500 mt-1 ml-1" />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={state.submitting}
                        className={`group w-full relative h-16 bg-gray-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all active:scale-[0.98] shadow-2xl shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {state.submitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enviando...
                            </>
                          ) : (
                            <>
                              Enviar Mensaje
                              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;