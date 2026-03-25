import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { BsCart3 } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { FiUser, FiSettings, FiList, FiLogOut, FiMenu, FiX, FiHome, FiPackage, FiBook, FiMail } from "react-icons/fi";

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
    { to: '/home', label: 'Inicio', icon: FiHome },
    { to: '/shop', label: 'Productos', icon: FiPackage },
    { to: '/blog', label: 'Sobre Nosotros', icon: FiBook },
    { to: '/contact', label: 'Contacto', icon: FiMail },
    { to: '/cart', label: 'Carrito', icon: BsCart3 },
    { to: '/wishlist', label: 'Favoritos', icon: GoHeart },
  ];

  return (
    <>
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
        <nav className="flex items-center justify-between px-4 mx-auto max-w-7xl h-16">

          {/* Left: hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="text-gray-600 hover:text-black transition-colors duration-150 md:hidden"
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              <FiMenu size={22} />
            </button>

            <Link to="/home" className="flex items-center gap-0.5 select-none" aria-label="PSG Shop - Inicio">
              <span className="text-xl font-black tracking-tight text-black">PSG</span>
              <span className="w-1 h-1 mx-1 rounded-full bg-black inline-block mb-0.5" />
              <span className="text-xs font-light tracking-widest text-gray-500 uppercase">SHOP</span>
            </Link>
          </div>

          {/* Center: desktop nav links */}
          <ul className="items-center hidden gap-1 md:flex">
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
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-150"
              aria-label="Lista de deseos"
            >
              <GoHeart size={20} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-black rounded-full">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-150"
              aria-label="Carrito"
            >
              <BsCart3 size={19} />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-black rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative ml-1" ref={profileMenuRef}>
              {currentUser ? (
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-bold hover:ring-2 hover:ring-gray-300 transition-all duration-150 overflow-hidden"
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
                  className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-150"
                  aria-label="Iniciar sesión"
                >
                  <FiUser size={18} />
                </Link>
              )}

              {/* Dropdown */}
              {currentUser && isProfileMenuOpen && (
                <div className="absolute right-0 z-50 w-60 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold overflow-hidden flex-shrink-0">
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
                        <FiSettings size={14} className="text-gray-400 group-hover:text-white" />
                        <span>Administrar página</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={closeProfileMenu}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-150 group"
                    >
                      <FiUser size={14} className="text-gray-400 group-hover:text-white" />
                      <span>Editar perfil</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeProfileMenu}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-900 hover:text-white transition-colors duration-150 group"
                    >
                      <FiList size={14} className="text-gray-400 group-hover:text-white" />
                      <span>Mis Pedidos</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-150 group"
                    >
                      <FiLogOut size={14} className="group-hover:text-white" />
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
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={toggleMenu} />
      )}

      {/* ─── Mobile Sidebar ─── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link to="/home" onClick={toggleMenu} className="flex items-center gap-0.5 select-none">
            <span className="text-lg font-black tracking-tight text-black">PSG</span>
            <span className="w-1 h-1 mx-1 rounded-full bg-black inline-block" />
            <span className="text-[10px] font-light tracking-widest text-gray-500 uppercase">SHOP</span>
          </Link>
          <button onClick={toggleMenu} className="text-gray-500 hover:text-black transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
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
        <div className="p-4 border-t border-gray-100 space-y-2">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold overflow-hidden flex-shrink-0">
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