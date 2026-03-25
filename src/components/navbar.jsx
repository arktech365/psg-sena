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
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    { to: '/home', label: 'Inicio', icon: <FiHome className="text-xs mr-2 opacity-50"/> },
    { to: '/shop', label: 'Tienda', icon: <FiShoppingBag className="text-xs mr-2 opacity-50"/> },
    { to: '/blog', label: 'Marca', icon: <FiInfo className="text-xs mr-2 opacity-50"/> },
    { to: '/contact', label: 'Contacto', icon: <FiMail className="text-xs mr-2 opacity-50"/> },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-sans ${
          scrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-xl shadow-slate-200/10' 
          : 'bg-white border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Mobile Trigger */}
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-2 text-slate-500 hover:text-indigo-600 transition-colors"
              onClick={toggleMenu}
            >
              <FiMenu size={22} />
            </button>

            <Link to="/home" className="flex items-center gap-2 group select-none">
              <div className="w-8 h-8 bg-[#111218] rounded-lg flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-105 active:scale-95">
                <span className="font-bold italic text-xs">P</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tighter text-[#111218] block leading-none">PSG SHOP</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative text-sm font-bold tracking-tight transition-all duration-300 flex items-center group ${
                    isActiveLink(to) ? 'text-[#1e147e]' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search conceptually could go here if implemented */}
            
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-xl transition-all duration-300 relative group text-slate-900 hover:text-black"
            >
              <FaRegHeart size={20} strokeWidth={1} />
              <span className="absolute top-1 right-1 flex items-center justify-center w-[18px] h-[18px] bg-[#111218] text-white text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                {wishlistItemCount}
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 rounded-xl transition-all duration-300 relative group text-slate-900 hover:text-black"
            >
              <FiShoppingBag size={20} strokeWidth={2} />
              <span className="absolute top-1 right-1 flex items-center justify-center w-[18px] h-[18px] bg-[#111218] text-white text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                {cartItemCount}
              </span>
            </Link>

            {/* User Profile / Login */}
            <div className="relative ml-2" ref={profileMenuRef}>
              {currentUser ? (
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group active:scale-95"
                >
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-[11px] shadow-lg shadow-indigo-600/20 overflow-hidden">
                    {userProfile?.profileImage ? (
                      <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{userProfile?.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                     <p className="text-xs font-bold text-slate-800 tracking-tight block max-w-[100px] truncate leading-tight">
                        {userProfile?.displayName || currentUser.email?.split('@')[0]}
                     </p>
                     <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">Membro</p>
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3.5 bg-[#111218] text-white rounded-2xl text-xs font-bold tracking-tight transition-all hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 active:scale-95"
                >
                  Identificarse
                </Link>
              )}

              {/* Profile Dropdown */}
              {currentUser && isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden z-[150] animate-in slide-in-from-top-4 duration-300">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                     <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold italic text-[10px]">
                        {currentUser.email?.charAt(0).toUpperCase()}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5 tracking-tight">{userProfile?.displayName || currentUser.email?.split('@')[0]}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate tracking-wider">{currentUser.email}</p>
                     </div>
                  </div>
                  <div className="p-1.5">
                    {isAdmin && (
                      <Link to="/admin" onClick={closeProfileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-900 hover:text-white transition-all group">
                        <FiGrid className="text-indigo-500 group-hover:text-white" size={14} />
                        <span className="tracking-tight">Dashboard Admin</span>
                      </Link>
                    )}
                    <Link to="/profile" onClick={closeProfileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-900 hover:text-white transition-all group">
                      <FiUser className="text-indigo-500 group-hover:text-white" size={14} />
                      <span className="tracking-tight">Mi Perfil</span>
                    </Link>
                    <Link to="/orders" onClick={closeProfileMenu} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-900 hover:text-white transition-all group">
                      <FiList className="text-indigo-500 group-hover:text-white" size={14} />
                      <span className="tracking-tight">Mis Pedidos</span>
                    </Link>
                    <div className="h-[1px] bg-slate-100 my-1 mx-3" />
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all tracking-tight">
                      <FiLogOut size={14} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Spacing for fixed header */}
      <div className="h-16 sm:h-20"></div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm animate-in fade-in duration-500" onClick={toggleMenu} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-[150] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col font-sans ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 flex items-center justify-between border-b border-slate-50">
          <Link to="/home" onClick={toggleMenu} className="flex items-center gap-3">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold italic text-xs">P</div>
             <span className="text-lg font-bold tracking-tighter">PSG SHOP</span>
          </Link>
          <button onClick={toggleMenu} className="p-2 text-slate-400 hover:text-black">
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-auto p-6">
           <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-6 px-4">Directorio</span>
           <ul className="space-y-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={toggleMenu}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-bold tracking-tight transition-all ${
                      isActiveLink(to) ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{label}</span>
                    <FiChevronRight className={isActiveLink(to) ? 'opacity-50' : 'text-slate-300'} />
                  </Link>
                </li>
              ))}
           </ul>
        </nav>

        <div className="p-8 space-y-4 border-t border-slate-50">
           {currentUser ? (
              <div className="flex flex-col gap-4">
                 <div className="px-6 py-4 bg-slate-50 rounded-3xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold italic text-sm">
                       {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                       <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{userProfile?.displayName || currentUser.email?.split('@')[0]}</p>
                       <p className="text-[8px] font-bold text-slate-400 truncate tracking-wider">Membro</p>
                    </div>
                 </div>
                 {isAdmin && (
                    <Link to="/admin" onClick={toggleMenu} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold tracking-tight text-center shadow-lg shadow-indigo-600/20">
                       Dashboard Admin
                    </Link>
                 )}
                 <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full py-4 text-rose-500 font-bold text-xs tracking-tight hover:bg-rose-50/50 rounded-2xl transition-all">
                    Cerrar Sesión
                 </button>
              </div>
           ) : (
              <Link to="/login" onClick={toggleMenu} className="w-full py-5 bg-[#111218] text-white rounded-2xl text-xs font-bold tracking-tight text-center shadow-xl shadow-slate-900/10">
                 Identificarse
              </Link>
           )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;