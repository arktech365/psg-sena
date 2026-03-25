import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  FiUser, FiSettings, FiList, FiLogOut, FiMenu, FiX, FiHome, 
  FiShoppingBag, FiInfo, FiMail, FiChevronRight, FiGrid
} from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa6";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAdmin, userProfile } = useAuth();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { to: '/home', label: 'Inicio', icon: <FiHome /> },
    { to: '/shop', label: 'Tienda', icon: <FiShoppingBag /> },
    { to: '/blog', label: 'Sobre Nosotros', icon: <FiInfo /> },
    { to: '/contact', label: 'Contacto', icon: <FiMail /> },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled 
          ? 'py-2' 
          : 'py-4'
        }`}
      >
        <nav className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
           scrolled 
           ? 'max-w-5xl' 
           : 'max-w-7xl'
        }`}>
          <div className={`flex items-center justify-between transition-all duration-300 px-6 rounded-2xl border ${
            scrolled 
            ? 'bg-white/80 backdrop-blur-md border-slate-200/50 shadow-lg h-14' 
            : 'bg-white border-transparent h-16'
          }`}>
            
            {/* Logo & Mobile Trigger */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-slate-500 hover:text-black transition-colors"
                onClick={toggleMenu}
              >
                <FiMenu size={20} />
              </button>

              <Link to="/home" className="flex items-center gap-2 group select-none">
                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                  <span className="font-bold italic text-[10px]">P</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-black tracking-tighter text-black">PSG</span>
                  <span className="w-1 h-1 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase">SHOP</span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center bg-slate-50/50 border border-slate-100 p-1 rounded-full">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-tight transition-all duration-200 ${
                      isActiveLink(to) 
                      ? 'bg-black text-white shadow-md' 
                      : 'text-slate-500 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-xl transition-all duration-200 relative group text-slate-600 hover:text-black hover:bg-slate-50"
              >
                <FaRegHeart size={18} />
                {wishlistItemCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-black text-white text-[8px] font-bold rounded-full border-2 border-white shadow-sm">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 rounded-xl transition-all duration-200 relative group text-slate-600 hover:text-black hover:bg-slate-50"
              >
                <FiShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-indigo-600 text-white text-[8px] font-bold rounded-full border-2 border-white shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

              {/* User Profile / Login */}
              <div className="relative" ref={profileMenuRef}>
                {currentUser ? (
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center gap-2 p-1 pl-1 pr-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 active:scale-95"
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-[10px] shadow-sm overflow-hidden">
                      {userProfile?.profileImage ? (
                        <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span>{userProfile?.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <p className="hidden sm:block text-[11px] font-bold text-slate-700 tracking-tight max-w-[80px] truncate">
                      {userProfile?.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
                    </p>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-black text-white rounded-full text-[11px] font-bold tracking-tight transition-all hover:bg-indigo-600 shadow-sm active:scale-95"
                  >
                    Entrar
                  </Link>
                )}

                {/* Profile Dropdown */}
                {currentUser && isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-[150] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                       <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{userProfile?.displayName || currentUser.email?.split('@')[0]}</p>
                       <p className="text-[9px] font-medium text-slate-400 truncate tracking-wider mt-0.5">{currentUser.email}</p>
                    </div>
                    <div className="p-1">
                      {isAdmin && (
                        <Link to="/admin" onClick={closeProfileMenu} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-black hover:text-white transition-all group">
                          <FiGrid className="text-indigo-500 group-hover:text-white" size={13} />
                          <span>Panel Admin</span>
                        </Link>
                      )}
                      <Link to="/profile" onClick={closeProfileMenu} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-black hover:text-white transition-all group">
                        <FiUser className="text-indigo-500 group-hover:text-white" size={13} />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link to="/orders" onClick={closeProfileMenu} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-black hover:text-white transition-all group">
                        <FiList className="text-indigo-500 group-hover:text-white" size={13} />
                        <span>Pedidos</span>
                      </Link>
                      <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                      <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-all">
                        <FiLogOut size={13} />
                        <span>Salir</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacing for fixed header */}
      <div className={`transition-all duration-300 ${scrolled ? 'h-16' : 'h-24'}`}></div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={toggleMenu} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[150] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <Link to="/home" onClick={toggleMenu} className="flex items-center gap-2">
             <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white font-bold italic text-[10px]">P</div>
             <span className="text-sm font-black tracking-tighter">PSG SHOP</span>
          </Link>
          <button onClick={toggleMenu} className="p-2 text-slate-400 hover:text-black transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-auto p-4">
           <span className="block text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">Menu</span>
           <ul className="space-y-1">
              {navLinks.map(({ to, label, icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold tracking-tight transition-all ${
                      isActiveLink(to) 
                      ? 'bg-black text-white shadow-lg' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={isActiveLink(to) ? 'text-indigo-400' : 'text-slate-400'}>{icon}</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
           </ul>
        </nav>

        <div className="p-6 border-t border-slate-50">
           {currentUser ? (
              <div className="space-y-3">
                 <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                       {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                       <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{userProfile?.displayName || currentUser.email?.split('@')[0]}</p>
                       <p className="text-[9px] font-medium text-slate-400 truncate tracking-wider">Cliente</p>
                    </div>
                 </div>
                 {isAdmin && (
                    <Link to="/admin" onClick={toggleMenu} className="block w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase text-center shadow-md">
                       Panel Admin
                    </Link>
                 )}
                 <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full py-3 text-rose-500 font-bold text-[11px] tracking-tight hover:bg-rose-50 rounded-xl transition-all">
                    Terminar Sesión
                 </button>
              </div>
           ) : (
              <Link to="/login" onClick={toggleMenu} className="block w-full py-4 bg-black text-white rounded-xl text-[11px] font-bold tracking-widest uppercase text-center shadow-lg">
                 Iniciar Sesión
              </Link>
           )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;