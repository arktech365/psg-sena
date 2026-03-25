import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  FaRegUser, 
  FaGear, 
  FaList, 
  FaArrowRightFromBracket, 
  FaBars, 
  FaXmark, 
  FaHouse, 
  FaBagShopping, 
  FaBookOpen, 
  FaEnvelope 
} from "react-icons/fa6";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, isAdmin, userProfile } = useAuth();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const toggleProfileMenu = () => setIsProfileMenuOpen(v => !v);
  const closeProfileMenu = () => setIsProfileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeProfileMenu();
      navigate('/home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;
  const isActiveLink = (path) => location.pathname === path;

  const navLinks = [
    { to: '/home', label: 'Inicio' },
    { to: '/shop', label: 'Productos' },
    { to: '/blog', label: 'Sobre Nosotros' },
    { to: '/contact', label: 'Contacto' },
  ];

  const mobileLinks = [
    { to: '/home', label: 'Inicio', icon: FaHouse },
    { to: '/shop', label: 'Productos', icon: FaBagShopping },
    { to: '/blog', label: 'Sobre Nosotros', icon: FaBookOpen },
    { to: '/contact', label: 'Contacto', icon: FaEnvelope },
    { to: '/cart', label: 'Carrito', icon: FiShoppingCart },
    { to: '/wishlist', label: 'Favoritos', icon: FiHeart },
  ];

  return (
    <>
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
        <nav className="flex justify-between items-center px-4 mx-auto max-w-7xl h-16">

          {/* Left: hamburger + Logo */}
          <div className="flex gap-3 items-center">
            <button
              className="text-gray-600 transition-colors duration-150 hover:text-black md:hidden"
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              <FaBars size={20} />
            </button>

            <Link to="/home" className="flex items-center gap-0.5 select-none" aria-label="PSG Shop - Inicio">
              <span className="text-xl font-black tracking-tight text-black">PSG</span>
              <span className="w-1 h-1 mx-1 rounded-full bg-black inline-block mb-0.5" />
              <span className="text-xs font-light tracking-widest text-gray-500 uppercase">SHOP</span>
            </Link>
          </div>

          {/* Center: desktop nav links */}
          <ul className="hidden gap-1 items-center md:flex">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative px-3 py-5 text-sm font-medium block transition-colors duration-200 group ${
                    isActiveLink(to) ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {label}
                  <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-black rounded-full transition-transform duration-200 origin-left ${
                    isActiveLink(to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: icon actions */}
          <div className="flex gap-1 items-center">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex relative justify-center items-center w-8 h-8 text-gray-800 rounded-full transition-all duration-150 hover:bg-gray-100"
              aria-label="Lista de deseos"
            >
              <FiHeart size={16} strokeWidth={2} />
              {wishlistItemCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-black rounded-full transform translate-x-1 -translate-y-1 shadow-sm">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex relative justify-center items-center w-8 h-8 text-gray-800 rounded-full transition-all duration-150 hover:bg-gray-100"
              aria-label="Carrito"
            >
              <FiShoppingCart size={16} strokeWidth={2} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-black rounded-full transform translate-x-1 -translate-y-1 shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative ml-1" ref={profileMenuRef}>
              {currentUser ? (
                <button
                  onClick={toggleProfileMenu}
                  className="flex overflow-hidden justify-center items-center w-9 h-9 text-xs font-bold text-white bg-gray-900 rounded-full transition-all duration-150 hover:ring-2 hover:ring-gray-300"
                  aria-label="Perfil"
                  aria-expanded={isProfileMenuOpen}
                >
                  {userProfile?.profileImage ? (
                    <img src={userProfile.profileImage} alt="Profile" className="object-cover w-full h-full" />
                  ) : (
                    <span>{userProfile?.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex justify-center items-center w-9 h-9 text-gray-600 rounded-full transition-all duration-150 hover:text-black hover:bg-gray-100"
                  aria-label="Iniciar sesión"
                >
                  <FaRegUser size={18} />
                </Link>
              )}

              {/* Dropdown */}
              {currentUser && isProfileMenuOpen && (
                <div className="overflow-hidden absolute right-0 z-50 mt-2 w-60 bg-white rounded-xl border border-gray-200 shadow-xl">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex gap-3 items-center">
                      <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-9 h-9 text-sm font-bold text-white bg-gray-900 rounded-full">
                        {userProfile?.profileImage ? (
                          <img src={userProfile.profileImage} alt="Profile" className="object-cover w-full h-full" />
                        ) : (
                          <span>{userProfile?.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userProfile?.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={closeProfileMenu}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-150 group"
                      >
                        <FaGear size={14} className="text-gray-400 group-hover:text-white" />
                        <span>Administrar página</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={closeProfileMenu}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-150 group"
                    >
                      <FaRegUser size={14} className="text-gray-400 group-hover:text-white" />
                      <span>Editar perfil</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeProfileMenu}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-150 group"
                    >
                      <FaList size={14} className="text-gray-400 group-hover:text-white" />
                      <span>Mis Pedidos</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-150 group"
                    >
                      <FaArrowRightFromBracket size={14} className="group-hover:text-white" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Overlay ─── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30" onClick={toggleMenu} />
      )}

      {/* ─── Mobile Sidebar ─── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Sidebar header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <Link to="/home" onClick={toggleMenu} className="flex items-center gap-0.5 select-none">
            <span className="text-lg font-black tracking-tight text-black">PSG</span>
            <span className="inline-block mx-1 w-1 h-1 bg-black rounded-full" />
            <span className="text-[10px] font-light tracking-widest text-gray-500 uppercase">SHOP</span>
          </Link>
          <button onClick={toggleMenu} className="text-gray-500 transition-colors hover:text-black">
            <FaXmark size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="overflow-y-auto flex-1 py-4">
          <ul className="space-y-0.5 px-3">
            {mobileLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={toggleMenu}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActiveLink(to) ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 space-y-2 border-t border-gray-100">
          {currentUser ? (
            <>
              <div className="flex gap-3 items-center px-3 py-2 mb-2">
                <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-8 h-8 text-xs font-bold text-white bg-gray-900 rounded-full">
                  {userProfile?.profileImage ? (
                    <img src={userProfile.profileImage} alt="Profile" className="object-cover w-full h-full" />
                  ) : (
                    <span>{userProfile?.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{userProfile?.displayName || currentUser.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={toggleMenu}
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Panel Administrativo
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;