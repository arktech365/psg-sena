import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { getAllUsers, updateUserRole as updateUserServiceRole } from '../../services/userService';
import { getAllReviews, deleteReview, updateReview } from '../../services/reviewService';
import { getAllOrders, updateOrderStatus, getOrderStatusText, getStatusBadgeClass } from '../../services/orderService';
import { getSalesData, getSalesByCategory, getOrderStatusDistribution, getTopSellingProducts, getUserRegistrationData, getRevenueByPaymentMethod } from '../../services/analyticsService';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import CouponManager from '../../components/CouponManager';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import Loader from '../../components/Loader';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiHome, FiShoppingBag, FiUsers, FiMessageSquare, 
  FiTag, FiPackage, FiBarChart2, FiPlus, FiLogOut, FiSun, FiMoon, 
  FiList, FiCheck, FiChevronRight, FiGrid, FiActivity, FiStar, FiImage, FiCamera, FiRefreshCw,
  FiLayers, FiTrash2
} from 'react-icons/fi';
import DashboardAnalytics from '../../components/admin/DashboardAnalytics';
import AdminProducts from '../../components/admin/AdminProducts';
import AdminUsers from '../../components/admin/AdminUsers';
import AdminReviews from '../../components/admin/AdminReviews';
import AdminOrders from '../../components/admin/AdminOrders';
import AdminCategories from '../../components/admin/AdminCategories';
import AdminProductModal from '../../components/admin/AdminProductModal';

const ModernAdminDashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('analytics');
  const [theme, setTheme] = useState('light');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: [],
    salesData: [],
    salesByCategory: [],
    orderStatusData: [],
    topSellingProducts: [],
    userRegistrationData: [],
    paymentMethodData: [],
    dateRange: 'last30days'
  });
  const [loading, setLoading] = useState(false);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', description: '', price: '', imageUrls: [], primaryImageIndex: 0, category: '', material: '', color: '', size: '', style: '', stock: 0, rating: 0
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState({});
  
  // Search states
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('add');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [editingCategoryImage, setEditingCategoryImage] = useState(null);
  const [editingCategoryImagePreview, setEditingCategoryImagePreview] = useState(null);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('adminDashboardTheme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminDashboardTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const categoriesList = await getCategories();
      setCategories(categoriesList);
    } catch (error) {
      setError('Error al cargar las categorías');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCategoryImageUpload = async (e, isEditing = false) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1024 * 1024) { alert("La imagen debe ser menor a 1MB."); return; }
      const base64Data = await fileToBase64(file);
      if (isEditing) {
        setEditingCategoryImage(base64Data);
        setEditingCategoryImagePreview(base64Data);
      } else {
        setCategoryImage(base64Data);
        setCategoryImagePreview(base64Data);
      }
    } catch (err) { setError("Error al procesar la imagen."); }
  };

  const clearCategoryImage = (isEditing = false) => {
    if (isEditing) {
      setEditingCategoryImage(null);
      setEditingCategoryImagePreview(null);
      if (editingCategory?.imageUrl) setEditingCategory({ ...editingCategory, imageUrl: null });
    } else {
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setNewCategory({ ...newCategory, imageUrl: null });
    }
  };

  const createCategoryHandler = async (e) => {
    e.preventDefault();
    if (!newCategory.name) { alert("Introduce un nombre."); return; }
    try {
      const categoryData = { ...newCategory };
      if (categoryImage) categoryData.imageUrl = categoryImage;
      await createCategory(categoryData);
      setNewCategory({ name: '', description: '' });
      setCategoryImage(null);
      setCategoryImagePreview(null);
      showSuccessMessage("Categoría creada exitosamente!");
      setCategoryModalOpen(false);
      fetchCategories();
    } catch (err) { setError("Error al crear la categoría."); }
  };

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const categoryData = { ...editingCategory };
      if (editingCategoryImage) categoryData.imageUrl = editingCategoryImage;
      await updateCategory(editingCategory.id, categoryData);
      showSuccessMessage("Categoría actualizada!");
      setCategoryModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) { setError("Error al actualizar."); }
  };

  const deleteCategoryHandler = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      showSuccessMessage("Categoría eliminada.");
    } catch (err) { setError("Error al eliminar."); }
  };

  const openAddCategoryModal = () => {
    setNewCategory({ name: '', description: '' });
    setCategoryImage(null);
    setCategoryImagePreview(null);
    setCategoryModalMode('add');
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory({ ...category });
    setEditingCategoryImage(null);
    setEditingCategoryImagePreview(null);
    setCategoryModalMode('edit');
    setCategoryModalOpen(true);
  };

  const handleLogout = async () => {
    try { await signOut(auth); navigate('/login'); } catch (error) { setError('Error al cerrar sesión'); }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amt || 0);
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      let startDate = new Date();
      switch (stats.dateRange) {
        case 'last7days': startDate.setDate(startDate.getDate() - 7); break;
        case 'last30days': startDate.setDate(startDate.getDate() - 30); break;
        case 'last90days': startDate.setDate(startDate.getDate() - 90); break;
        case 'lastYear': startDate.setFullYear(startDate.getFullYear() - 1); break;
        default: startDate.setDate(startDate.getDate() - 30);
      }
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      let totalRev = 0; ordersSnapshot.docs.forEach(d => totalRev += d.data().totalAmount || 0);
      const usersList = await getAllUsers();
      const reviewsList = await getAllReviews();
      const salesData = await getSalesData(startDate, endDate);
      const salesByCategory = await getSalesByCategory();
      const orderStatusData = await getOrderStatusDistribution();
      const topSellingProducts = await getTopSellingProducts(10);
      const userRegistrationData = await getUserRegistrationData(startDate, endDate);
      const paymentMethodData = await getRevenueByPaymentMethod();
      
      setStats({
        totalProducts: productsSnapshot.size,
        totalOrders: ordersSnapshot.size,
        totalUsers: usersList.length,
        totalReviews: reviewsList.length,
        totalRevenue: totalRev,
        recentOrders: [], // can be filled if needed
        recentUsers: usersList.slice(0, 5),
        salesData: salesData.salesData,
        salesByCategory,
        orderStatusData,
        topSellingProducts,
        userRegistrationData: userRegistrationData.registrationData,
        paymentMethodData,
        dateRange: stats.dateRange
      });
    } catch (e) { setError('Error en estadísticas.'); } finally { setLoading(false); }
  };

  const handleDateRangeChange = (range) => setStats(prev => ({ ...prev, dateRange: range }));
  
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { setError('Error en productos.'); } finally { setProductsLoading(false); }
  };

  const fetchUsers = async () => { try { setUsersLoading(true); setUsers(await getAllUsers()); } catch (err) { setError('Error en usuarios.'); } finally { setUsersLoading(false); } };
  const fetchReviews = async () => { try { setReviewsLoading(true); setReviews(await getAllReviews()); } catch (err) { setError('Error en reviews.'); } finally { setReviewsLoading(false); } };
  const fetchOrders = async () => { try { setOrdersLoading(true); setOrders(await getAllOrders()); } catch (err) { setError('Error en pedidos.'); } finally { setOrdersLoading(false); } };

  useEffect(() => {
    if (isAdmin) {
      switch (activeSection) {
        case 'analytics': fetchDashboardStats(); break;
        case 'products': fetchProducts(); fetchCategories(); break;
        case 'users': fetchUsers(); break;
        case 'reviews': fetchReviews(); break;
        case 'orders': fetchOrders(); break;
        case 'categories': fetchCategories(); break;
        default: fetchDashboardStats();
      }
    }
  }, [activeSection, isAdmin, stats.dateRange]);

  const handleProductChange = (e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  const handleEditProductChange = (e) => setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });

  const handleImageSelect = async (isEditing = false) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.multiple = true;
    fileInput.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      const currentImages = isEditing ? editingProduct.imageUrls : newProduct.imageUrls;
      if (currentImages.length + files.length > 4) { setError("Máximo 4 imágenes."); return; }
      setUploading(true);
      const imageDataArray = [];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        imageDataArray.push({ name: file.name, type: file.type, data: base64, timestamp: Date.now() });
      }
      if (isEditing) setEditingProduct({ ...editingProduct, imageUrls: [...editingProduct.imageUrls, ...imageDataArray] });
      else setNewProduct({ ...newProduct, imageUrls: [...newProduct.imageUrls, ...imageDataArray] });
      setUploading(false);
    };
    fileInput.click();
  };

  const removeImage = (idx, isEditing = false) => {
    if (isEditing) {
      const imgs = [...editingProduct.imageUrls]; imgs.splice(idx, 1);
      setEditingProduct({ ...editingProduct, imageUrls: imgs });
    } else {
      const imgs = [...newProduct.imageUrls]; imgs.splice(idx, 1);
      setNewProduct({ ...newProduct, imageUrls: imgs });
    }
  };

  const setPrimaryImage = (idx, isEditing = false) => {
    if (isEditing) setEditingProduct({ ...editingProduct, primaryImageIndex: idx });
    else setNewProduct({ ...newProduct, primaryImageIndex: idx });
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), { ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock), rating: parseFloat(newProduct.rating), createdAt: new Date() });
      showSuccessMessage("Producto creado!");
      setProductModalOpen(false);
      fetchProducts();
    } catch (err) { setError("Error al crear producto."); }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "products", editingProduct.id), { ...editingProduct, price: parseFloat(editingProduct.price), stock: parseInt(editingProduct.stock), rating: parseFloat(editingProduct.rating), updatedAt: new Date() });
      showSuccessMessage("Producto actualizado!");
      setProductModalOpen(false);
      fetchProducts();
    } catch (err) { setError("Error al actualizar."); }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`¿Eliminar ${name}?`)) return;
    try { await deleteDoc(doc(db, "products", id)); fetchProducts(); showSuccessMessage("Eliminado."); } catch (err) { setError("Error."); }
  };

  const openAddProductModal = () => { setModalMode('add'); setProductModalOpen(true); };
  const openEditProductModal = (p) => { setEditingProduct({ ...p }); setModalMode('edit'); setProductModalOpen(true); };

  const updateUserRole = async (userId, newRole) => {
    try { await updateUserServiceRole(userId, newRole); fetchUsers(); showSuccessMessage("Rol actualizado."); } catch (err) { setError("Error."); }
  };

  const saveEditedReview = async (e) => {
    e.preventDefault();
    try {
      await updateReview(editingReview.id, { rating: editingReview.rating, comment: editingReview.comment });
      setReviewModalOpen(false);
      fetchReviews();
      showSuccessMessage("Reseña actualizada.");
    } catch (err) { setError("Error."); }
  };

  const deleteReviewHandler = async (id) => {
    if (!window.confirm("¿Eliminar reseña?")) return;
    try { await deleteReview(id); fetchReviews(); showSuccessMessage("Eliminado."); } catch (err) { setError("Error."); }
  };

  const openEditReviewModal = (r) => { setEditingReview({ ...r }); setReviewModalOpen(true); };
  const openOrderDetails = (o) => { setSelectedOrder(o); setOrderModalOpen(true); };
  const closeOrderDetails = () => { setOrderModalOpen(false); setSelectedOrder(null); };

  const deleteOrder = async (id) => {
    if (!window.confirm("¿Eliminar pedido?")) return;
    try { await deleteDoc(doc(db, "orders", id)); fetchOrders(); showSuccessMessage("Eliminado."); } catch (err) { setError("Error."); }
  };

  const updateOrderStatusHandler = async (id, status) => {
    try {
      setOrderStatusUpdating(prev => ({ ...prev, [id]: true }));
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) { setError("Error."); } finally { setOrderStatusUpdating(prev => ({ ...prev, [id]: false })); }
  };

  const navItems = [
    { id: 'analytics', label: 'Estrategia', icon: <FiActivity /> },
    { id: 'products', label: 'Inventario', icon: <FiGrid /> },
    { id: 'categories', label: 'Colecciones', icon: <FiLayers /> },
    { id: 'users', label: 'Clientes', icon: <FiUsers /> },
    { id: 'reviews', label: 'Feedback', icon: <FiStar /> },
    { id: 'coupons', label: 'Cupones', icon: <FiTag /> },
    { id: 'orders', label: 'Logística', icon: <FiPackage /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return <DashboardAnalytics 
          stats={stats} 
          loading={loading} 
          theme={theme} 
          handleDateRangeChange={handleDateRangeChange} 
          formatCurrency={formatCurrency} 
          formatDate={formatDate} 
          getStatusBadgeClass={getStatusBadgeClass} 
          getOrderStatusText={getOrderStatusText} 
        />;
      case 'products':
        return <AdminProducts 
          products={products}
          productsLoading={productsLoading}
          productSearchTerm={productSearchTerm}
          setProductSearchTerm={setProductSearchTerm}
          theme={theme}
          formatCurrency={formatCurrency}
          openAddProductModal={openAddProductModal}
          openEditProductModal={openEditProductModal}
          deleteProduct={deleteProduct}
        />;
      case 'users':
        return <AdminUsers 
          users={users}
          usersLoading={usersLoading}
          userSearchTerm={userSearchTerm}
          setUserSearchTerm={setUserSearchTerm}
          userRoleFilter={userRoleFilter}
          setUserRoleFilter={setUserRoleFilter}
          theme={theme}
          updateUserRole={updateUserRole}
        />;
      case 'reviews':
        return <AdminReviews 
          reviews={reviews}
          reviewsLoading={reviewsLoading}
          reviewSearchTerm={reviewSearchTerm}
          setReviewSearchTerm={setReviewSearchTerm}
          theme={theme}
          formatDate={formatDate}
          openEditReviewModal={openEditReviewModal}
          deleteReviewHandler={deleteReviewHandler}
        />;
      case 'orders':
        return <AdminOrders 
          orders={orders}
          ordersLoading={ordersLoading}
          orderSearchTerm={orderSearchTerm}
          setOrderSearchTerm={setOrderSearchTerm}
          theme={theme}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusBadgeClass={getStatusBadgeClass}
          getOrderStatusText={getOrderStatusText}
          orderStatusUpdating={orderStatusUpdating}
          updateOrderStatusHandler={updateOrderStatusHandler}
          openOrderDetails={openOrderDetails}
          deleteOrder={deleteOrder}
        />;
      case 'categories':
        return <AdminCategories 
          categories={categories}
          categoriesLoading={categoriesLoading}
          categorySearchTerm={categorySearchTerm}
          setCategorySearchTerm={setCategorySearchTerm}
          theme={theme}
          openAddCategoryModal={openAddCategoryModal}
          openEditCategoryModal={openEditCategoryModal}
          deleteCategoryHandler={deleteCategoryHandler}
        />;
      case 'coupons':
        return (
          <div className="w-full">
            <CouponManager theme={theme} />
          </div>
        );
      default:
        return <div className="p-10 text-center uppercase font-black text-slate-400">Section selection required.</div>;
    }
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#111218]' : 'bg-slate-50';
  const sidebarBg = isDark ? 'bg-[#1a1b26] border-slate-800' : 'bg-white border-slate-100 shadow-xl';
  const headerBg = isDark ? 'bg-[#1a1b26]/80 border-slate-800' : 'bg-white/80 border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen flex w-full overflow-hidden ${bgMain}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* SUCCESS/ERROR TOASTS */}
      <div className="fixed top-8 right-8 z-[200] space-y-4">
        {successMessage && (
          <div className="px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-500">
            <FiCheck className="text-xl" /> <span className="text-sm font-black uppercase tracking-widest">{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="px-6 py-4 bg-rose-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-500">
            <FiX className="text-xl" /> <span className="text-sm font-black uppercase tracking-widest">{error}</span>
          </div>
        )}
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* LUXURY SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[150] w-72 ${sidebarBg} border-r transform transition-transform duration-500 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full pt-10 px-8 pb-10">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black italic shadow-2xl">P</div>
              <h1 className={`text-xl font-black tracking-tighter ${textTitle}`}>PSG ADMIN</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><FiX size={24} /></button>
          </div>
          
          <nav className="flex-1 space-y-1">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Command Center</span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`flex items-center w-full px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  activeSection === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 active:scale-95' 
                    : `text-slate-400 hover:bg-indigo-500/5 ${isDark ? 'hover:text-slate-100' : 'hover:text-indigo-600'}`
                }`}
              >
                <span className={`mr-4 transition-transform group-hover:scale-110 ${activeSection === item.id ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                {activeSection === item.id && <FiChevronRight className="ml-auto opacity-50" />}
              </button>
            ))}
          </nav>

        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* LUXURY TOP NAV */}
        <header className={`sticky top-0 z-[100] ${headerBg} backdrop-blur-md border-b px-8 py-5 flex items-center justify-between`}>
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><FiMenu size={24} /></button>
            <div>
              <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${textTitle}`}>
                {navItems.find(i => i.id === activeSection)?.label || 'Dashboard'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                 <FiHome className="text-slate-400" size={12}/>
                 <FiChevronRight className="text-slate-300" size={10}/>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className={`p-4 rounded-2xl transition-all active:scale-90 ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-indigo-600 shadow-sm'}`}>
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <div className="relative" ref={profileMenuRef}>
              <div 
                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                 className="flex items-center gap-4 cursor-pointer p-1 rounded-2xl transition-all hover:bg-slate-500/10 hover:scale-105 active:scale-95"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl transition-all ${isProfileMenuOpen ? 'ring-4 ring-indigo-500/20' : ''} ${isDark ? 'bg-indigo-600' : 'bg-black'}`}>
                  {currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${textTitle}`}>{currentUser?.email?.split('@')[0]}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                </div>
              </div>

              {/* LUXURY DROPDOWN */}
              {isProfileMenuOpen && (
                <div className={`absolute right-0 mt-4 w-64 rounded-3xl border shadow-2xl overflow-hidden z-[150] animate-in slide-in-from-top-4 duration-300 ${isDark ? 'bg-[#1a1b26] border-slate-800 shadow-black' : 'bg-white border-slate-100'}`}>
                   <div className="p-2 space-y-1">
                      <button 
                         onClick={() => { navigate('/'); setIsProfileMenuOpen(false); }}
                         className={`flex items-center w-full gap-4 px-5 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                      >
                         <FiHome className="text-indigo-500" size={16} />
                         <span>Volver a la Web</span>
                      </button>
                      <div className={`h-[1px] mx-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                      <button 
                         onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                         className="flex items-center w-full gap-4 px-5 py-4 rounded-2xl transition-all text-rose-500 hover:bg-rose-500/10 text-xs font-black uppercase tracking-widest"
                      >
                         <FiLogOut size={16} />
                         <span>Cerrar Sesión</span>
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 overflow-auto p-10 lg:p-14">
          <div className="max-w-[1600px] mx-auto">
            {isAdmin ? renderContent() : (
              <div className="flex flex-col items-center justify-center py-20">
                <FiX className="text-rose-500 mb-4" size={48} />
                <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Acceso Denegado</p>
                <button onClick={() => navigate('/')} className="mt-8 px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest">Volver al Home</button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODALS INTEGRATION */}
      <AdminProductModal 
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        theme={theme}
        modalMode={modalMode}
        newProduct={newProduct}
        editingProduct={editingProduct}
        categories={categories}
        handleProductChange={handleProductChange}
        handleEditProductChange={handleEditProductChange}
        createProduct={createProduct}
        updateProduct={updateProduct}
        handleImageSelect={handleImageSelect}
        uploading={uploading}
        removeImage={removeImage}
        setPrimaryImage={setPrimaryImage}
      />

      {/* LUXURY REVIEW MODAL */}
      {reviewModalOpen && editingReview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-xl rounded-[2.5rem] border shadow-2xl relative animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#1a1b26] border-slate-800' : 'bg-white border-slate-100'} p-12`}>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-black tracking-tight ${textTitle}`}>Moderación de Reseña</h3>
                <p className={textSub}>Ajusta la calificación o el contenido del feedback.</p>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"><FiX/></button>
            </div>
            <form onSubmit={saveEditedReview} className="space-y-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Nivel de Calificación</span>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setEditingReview({...editingReview, rating: s})} className="transition-transform active:scale-75">
                      <FiStar size={32} className={`${s <= editingReview.rating ? 'fill-amber-400 text-amber-400 shadow-amber-500/20' : 'text-slate-200 fill-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Comentario Editado</label>
                <textarea name="comment" rows={5} value={editingReview.comment} onChange={(e) => setEditingReview({...editingReview, comment: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
              <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* LUXURY CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-xl rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#1a1b26] border-slate-800' : 'bg-white border-slate-100'} p-12`}>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-black tracking-tight ${textTitle}`}>{categoryModalMode === 'add' ? 'Nueva Colección' : 'Refinar Colección'}</h3>
                <p className={textSub}>Define los parámetros de la categoría.</p>
              </div>
              <button onClick={() => setCategoryModalOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"><FiX/></button>
            </div>
            <form onSubmit={categoryModalMode === 'add' ? createCategoryHandler : updateCategoryHandler} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Título de Colección</label>
                <input type="text" name="name" value={categoryModalMode === 'add' ? newCategory.name : editingCategory?.name} onChange={categoryModalMode === 'add' ? (e) => setNewCategory({...newCategory, name: e.target.value}) : (e) => setEditingCategory({...editingCategory, name: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Descripción Conceptual</label>
                <textarea name="description" rows={3} value={categoryModalMode === 'add' ? newCategory.description : editingCategory?.description} onChange={categoryModalMode === 'add' ? (e) => setNewCategory({...newCategory, description: e.target.value}) : (e) => setEditingCategory({...editingCategory, description: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Visual Identitario</label>
                <div className="flex items-center gap-6">
                  {((categoryModalMode === 'add' && categoryImagePreview) || (categoryModalMode === 'edit' && (editingCategoryImagePreview || editingCategory?.imageUrl))) ? (
                    <div className="relative group w-24 h-24 rounded-2xl overflow-hidden shadow-2xl">
                      <img src={categoryModalMode === 'add' ? categoryImagePreview : (editingCategoryImagePreview || editingCategory?.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => clearCategoryImage(categoryModalMode === 'edit')} className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><FiTrash2/></button>
                    </div>
                  ) : (
                    <label className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDark ? 'bg-slate-900 border-slate-700 hover:border-indigo-600' : 'bg-slate-50 border-slate-200 hover:border-indigo-600'}`}>
                      <FiCamera className="text-slate-300" size={24}/>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleCategoryImageUpload(e, categoryModalMode === 'edit')} />
                    </label>
                  )}
                  <p className="text-[10px] text-slate-400 font-bold max-w-[150px]">Recomendado: 800x800px. Máximo 1MB.</p>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-2xl transition-all">
                {categoryModalMode === 'add' ? 'Lanzar Colección' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

      <OrderDetailsModal isOpen={orderModalOpen} onClose={closeOrderDetails} order={selectedOrder} theme={theme} />
    </div>
  );
};

export default ModernAdminDashboard;