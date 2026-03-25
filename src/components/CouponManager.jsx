import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { FiPlus, FiTrash2, FiEdit3, FiCheckCircle, FiXCircle, FiGrid, FiClock, FiPercent, FiDollarSign, FiCalendar, FiAlertCircle, FiX } from 'react-icons/fi';

const CouponManager = ({ theme = 'light' }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state for new or editing coupon
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    discountType: 'percentage',
    discountValue: '',
    isActive: true,
    expiryDate: ''
  });
  
  const couponsCollectionRef = collection(db, "coupons");

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const couponsQuery = query(couponsCollectionRef, orderBy("createdAt", "desc"));
      const data = await getDocs(couponsQuery);
      setCoupons(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      setError("No se pudieron cargar los cupones.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openForm = (coupon = null) => {
    if (coupon) {
      setFormData({
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        isActive: coupon.isActive,
        expiryDate: coupon.expiryDate ? (coupon.expiryDate.toDate ? coupon.expiryDate.toDate().toISOString().split('T')[0] : coupon.expiryDate) : ''
      });
    } else {
      setFormData({ id: null, code: '', discountType: 'percentage', discountValue: '', isActive: true, expiryDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.discountType === 'percentage' && (formData.discountValue < 1 || formData.discountValue > 100)) {
      setError("Porcentaje inválido."); return;
    }
    
    try {
      let expiryDateValue = null;
      if (formData.expiryDate) {
        const dateObj = new Date(formData.expiryDate);
        if (!isNaN(dateObj.getTime())) expiryDateValue = dateObj;
      }

      if (formData.id) {
        // Update
        const updateData = {
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          isActive: formData.isActive,
          updatedAt: new Date(),
          ...(expiryDateValue && { expiryDate: expiryDateValue })
        };
        await updateDoc(doc(db, "coupons", formData.id), updateData);
        showSuccessMessage("Cupón actualizado.");
      } else {
        // Create
        const couponData = {
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          isActive: formData.isActive,
          createdAt: new Date(),
          ...(expiryDateValue && { expiryDate: expiryDateValue })
        };
        await addDoc(couponsCollectionRef, couponData);
        showSuccessMessage("Cupón creado.");
      }
      
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setError("Error al procesar el cupón.");
    }
  };

  const deleteCoupon = async (id, code) => {
    if (!window.confirm(`¿Seguro que quieres eliminar "${code}"?`)) return;
    try {
      await deleteDoc(doc(db, "coupons", id));
      showSuccessMessage("Cupón eliminado.");
      fetchCoupons();
    } catch (err) {
      setError("Error al eliminar.");
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Sin fecha';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const d = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    return d < new Date();
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amt || 0);

  // Stats logic
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.isActive && !isExpired(c.expiryDate)).length,
    expired: coupons.filter(c => isExpired(c.expiryDate)).length
  };

  // Dark Mode Tokens (Luxury Style)
  const isDark = theme === 'dark';
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-gray-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const modalOverlay = isDark ? 'bg-black/80 backdrop-blur-sm' : 'bg-slate-900/40 backdrop-blur-sm';

  return (
    <div className={`p-4 md:p-8 min-h-screen ${isDark ? 'bg-[#111218] text-slate-200' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header with Title & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textTitle}`}>Gestión de Cupones</h1>
          <p className={textSub}>Crea, edita y monitorea los beneficios de tu tienda.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-indigo-500/20 hover:shadow-2xl active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-1 group-hover:translate-y-0 transition-transform"></div>
          <FiPlus className="text-xl" /> Nuevo Beneficio
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Cupones Totales', val: stats.total, icon: FiGrid, color: 'indigo' },
          { label: 'Vigentes Ahora', val: stats.active, icon: FiCheckCircle, color: 'emerald' },
          { label: 'Expirados', val: stats.expired, icon: FiClock, color: 'rose' },
        ].map((s, idx) => (
          <div key={idx} className={`${bgCard} p-8 rounded-[2rem] border relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 bg-${s.color}-500/5 rounded-full transition-transform group-hover:scale-150`}></div>
            <div className="relative flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${s.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' : s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                <s.icon size={28} />
              </div>
              <div>
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${textSub}`}>{s.label}</span>
                <h4 className={`text-4xl font-black mt-1 ${textTitle}`}>{s.val}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className={`${bgCard} rounded-[2rem] border overflow-hidden`}>
        <div className="px-10 py-8 border-b border-inherit bg-inherit flex items-center justify-between">
          <h3 className={`text-xl font-bold ${textTitle}`}>Catálogo de Cupones</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En tiempo real</span>
          </div>
        </div>

        <div className="overflow-x-auto px-4 py-4">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub}`}>
                <th className="px-8 py-6">Código de Cupón</th>
                <th className="px-8 py-6">Valor Beneficio</th>
                <th className="px-8 py-6">Estado</th>
                <th className="px-8 py-6">Fecha Expiración</th>
                <th className="px-8 py-6 text-right pr-12">Opciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
              {!loading && coupons.map((c) => {
                const expired = isExpired(c.expiryDate);
                return (
                  <tr key={c.id} className="group hover:bg-indigo-500/5 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className={`font-black text-lg tracking-tight ${textTitle}`}>{c.code}</span>
                        <span className={`text-[10px] font-medium opacity-50`}>ID: {c.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.discountType === 'percentage' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {c.discountType === 'percentage' ? <FiPercent /> : <FiDollarSign />}
                        </div>
                        <span className={`font-bold text-base ${textTitle}`}>
                          {c.discountType === 'percentage' ? `${c.discountValue}%` : formatCurrency(c.discountValue)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {expired ? (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20">
                           Expirado
                        </span>
                      ) : c.isActive ? (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                           Vigente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-500 ring-1 ring-slate-500/20">
                           Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${expired ? 'text-rose-400 opacity-60 line-through' : textTitle}`}>
                          {formatDate(c.expiryDate)}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">{expired ? 'Caducado' : 'Próxima fecha'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 transition-all">
                        <button 
                          onClick={() => openForm(c)}
                          className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-indigo-400 hover:bg-slate-700 hover:shadow-indigo-500/10' : 'bg-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                          title="Editar Cupón"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteCoupon(c.id, c.code)}
                          className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-rose-500/20 hover:shadow-rose-500/10' : 'bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                          title="Eliminar Cupón"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <div className="py-20 text-center"><div className="w-12 h-12 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin mx-auto"></div></div>}
          {!loading && coupons.length === 0 && <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Sin resultados registrados.</div>}
        </div>
      </div>

      {/* STUNNING MODAL */}
      {isModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${modalOverlay} animate-in fade-in duration-300`}>
          <div 
            className={`w-full max-w-xl rounded-[2.5rem] border shadow-2xl relative animate-in zoom-in-95 duration-300 p-1 md:p-2 ${bgCard}`}
          >
            <div className={`p-10 ${isDark ? 'bg-[#1a1b26]' : 'bg-white'} rounded-[2.4rem]`}>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className={`text-2xl font-black tracking-tight ${textTitle}`}>
                    {formData.id ? 'Refinar Cupón' : 'Propulsar Campaña'}
                  </h3>
                  <p className={textSub}>Define los parámetros del nuevo beneficio.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className={`p-3 rounded-2xl transition-colors ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Código Promocional</label>
                    <input
                      name="code"
                      required
                      value={formData.code}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                        isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-white border-slate-200 focus:ring-indigo-500/10 text-slate-900'
                      }`}
                      placeholder="EJ: BLACKFRIDAY"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Tipo de Oferta</label>
                    <div className={`p-1 flex rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                      {['percentage', 'fixed'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, discountType: type})}
                          className={`flex-1 py-3 px-4 rounded-[0.9rem] flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                            formData.discountType === type
                              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {type === 'percentage' ? <FiPercent /> : <FiDollarSign />}
                          {type === 'percentage' ? '%' : '$'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Valor del Descuento</label>
                    <input
                      name="discountValue"
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      className={`w-full px-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                        isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-white border-slate-200 focus:ring-indigo-500/10 text-slate-900'
                      }`}
                      placeholder={formData.discountType === 'percentage' ? 'Ej: 15%' : 'Ej: 50.000'}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-1 ${textSub}`}>Fecha de Límite</label>
                    <div className="relative">
                      <FiCalendar className={`absolute left-5 top-1/2 -translate-y-1/2 ${textSub}`} />
                      <input
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                          isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-white border-slate-200 focus:ring-indigo-500/10 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-[1.5rem] border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'} flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-900 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'}`}>
                      <FiCheckCircle size={22} />
                    </div>
                    <div>
                      <p className={`text-sm font-black ${textTitle}`}>Vínculo Activo</p>
                      <p className="text-[10px] opacity-60">El cupón será canjeable inmediatamente.</p>
                    </div>
                  </div>
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-8 h-8 rounded-xl border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-base transition-all hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95"
                  >
                    {formData.id ? 'Guardar Cambios' : 'Lanzar Cupón 🔥'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Message */}
      {successMessage && (
        <div className="fixed bottom-10 right-10 z-[100] p-5 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-emerald-500 p-2 rounded-xl text-white"><FiCheckCircle size={20} /></div>
          <p className="text-sm font-bold pr-4">{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CouponManager;