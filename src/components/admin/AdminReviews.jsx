import React from 'react';
import Loader from '../Loader';
import { FiMessageSquare, FiEdit3, FiTrash2, FiSearch, FiStar, FiUser, FiActivity } from 'react-icons/fi';

const AdminReviews = ({
  reviews,
  reviewsLoading,
  reviewSearchTerm,
  setReviewSearchTerm,
  theme,
  formatDate,
  openEditReviewModal,
  deleteReviewHandler
}) => {
  if (reviewsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Escaneando Opiniones...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  const filteredReviews = reviews.filter(review =>
    (review.productName && review.productName.toLowerCase().includes(reviewSearchTerm.toLowerCase())) ||
    (review.createdAt && formatDate(review.createdAt).toLowerCase().includes(reviewSearchTerm.toLowerCase()))
  );

  // Luxury UI Tokens
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filter Zone */}
      <div className={`${bgCard} p-8 md:p-10 rounded-[2.5rem] border flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Feedback Moderation</span>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${textTitle}`}>Moderación de Reseñas</h2>
          <p className={`${textSub} mt-1 text-sm`}>Supervisa y gestiona la reputación de tus productos en el mercado.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <div className="relative w-full md:w-80 group">
            <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
            <input
              type="text"
              placeholder="Buscar por producto o fecha..."
              value={reviewSearchTerm}
              onChange={(e) => setReviewSearchTerm(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Reviews Table Card */}
      <div className={`${bgCard} rounded-[2.5rem] border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} border-b border-inherit`}>
                <th className="px-10 py-6">Calificación y Comentario</th>
                <th className="px-10 py-6">Producto Asociado</th>
                <th className="px-10 py-6">Fecha Registro</th>
                <th className="px-10 py-6 text-right pr-14">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
              {filteredReviews.map((r) => (
                <tr key={r.id} className="group hover:bg-indigo-500/5 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black shadow-inner ${
                        isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                         <FiMessageSquare size={20} />
                      </div>
                      <div className="flex flex-col max-w-sm">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star} 
                              size={12}
                              className={star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} 
                            />
                          ))}
                        </div>
                        <p className={`text-sm leading-relaxed ${textTitle} opacity-80 italic`}>
                          "{r.comment ? (r.comment.length > 50 ? r.comment.substring(0, 50) + '...' : r.comment) : 'Sin comentarios.'}"
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className={`font-black text-sm tracking-tight ${textTitle}`}>{r.productName || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Review ID: {r.id.slice(-6).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${textSub}`}>
                      {formatDate(r.createdAt)}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right pr-14">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openEditReviewModal(r)} 
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-indigo-400 hover:bg-slate-700' : 'bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                        title="Ver / Editar"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteReviewHandler(r.id)} 
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-rose-500/20' : 'bg-slate-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredReviews.length === 0 && (
            <div className="py-24 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <FiActivity size={32} className="opacity-20" />
              </div>
              <h3 className={`text-lg font-black ${textTitle}`}>Aún no hay reseñas</h3>
              <p className={`${textSub} text-sm mt-2`}>Las opiniones de tus clientes aparecerán aquí una vez que comiencen a calificar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
