import React from 'react';
import Loader from '../Loader';
import { FiMessageSquare, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

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
    return <Loader text="Cargando reseñas..." size="lg" />;
  }

  const filteredReviews = reviews.filter(review =>
    (review.productName && review.productName.toLowerCase().includes(reviewSearchTerm.toLowerCase())) ||
    (review.createdAt && formatDate(review.createdAt).toLowerCase().includes(reviewSearchTerm.toLowerCase()))
  );

  const cardClass = `p-6 transition-all duration-300 backdrop-blur-md bg-white/80 shadow-xl border border-gray-100 rounded-3xl ${
    theme === 'dark' ? 'dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-2xl' : ''
  } w-full`;

  return (
    <div className={`${cardClass} animate-fadeIn`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
            Moderación de Reseñas
          </h2>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Gestiona los comentarios y calificaciones de productos
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <input
              type="text"
              placeholder="Buscar reseñas..."
              value={reviewSearchTerm}
              onChange={(e) => setReviewSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700 text-white placeholder-gray-500 focus:bg-slate-800' 
                  : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
              }`}
            />
            <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
            }`} size={18} />
          </div>
        </div>
      </div>
      
      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-slate-700/50">
            <thead className={theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-gray-50/90 backdrop-blur-sm'}>
              <tr>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Detalles</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Producto</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Fecha</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-right uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
              {filteredReviews.map((review) => (
                <tr key={review.id} className={`transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-slate-700/40 bg-transparent' : 'hover:bg-blue-50/30 bg-transparent'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} mr-4`}>
                        <FiMessageSquare size={20} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= review.rating ? 'text-yellow-400' : (theme === 'dark' ? 'text-slate-600' : 'text-gray-300')}>★</span>
                          ))}
                        </div>
                        <div className={`text-sm truncate max-w-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {review.comment ? (review.comment.length > 30 ? review.comment.substring(0, 30) + '...' : review.comment) : 'Sin comentario'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{review.productName || 'Producto eliminado'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(review.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => openEditReviewModal(review)} 
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:scale-110' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-110'
                        }`}
                        title="Editar reseña"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteReviewHandler(review.id)} 
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110'
                        }`}
                        title="Eliminar reseña"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredReviews.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <FiMessageSquare size={32} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">
                {reviewSearchTerm ? 'No se encontraron reseñas' : 'No hay reseñas disponibles'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
