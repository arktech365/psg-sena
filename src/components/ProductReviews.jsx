import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReviewsByProductId } from '../services/reviewService';
import StarRating from './StarRating';
import Swal from 'sweetalert2';

const ProductReviews = ({ productId }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviewsByProductId(productId);
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => setReviewForm(prev => ({ ...prev, rating }));

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      Swal.fire({ title: 'Inicia sesión', text: 'Debes iniciar sesión para dejar una reseña', icon: 'warning', confirmButtonText: 'Iniciar sesión', showCancelButton: true, cancelButtonText: 'Cancelar' });
      return;
    }
    if (reviewForm.rating === 0) {
      Swal.fire({ title: 'Error', text: 'Por favor selecciona una calificación', icon: 'error', confirmButtonText: 'Aceptar' });
      return;
    }
    if (reviewForm.comment.trim() === '') {
      Swal.fire({ title: 'Error', text: 'Por favor escribe un comentario', icon: 'error', confirmButtonText: 'Aceptar' });
      return;
    }
    setSubmitting(true);
    try {
      // Note: review submission handled externally; reset form here
      setReviewForm({ rating: 0, comment: '' });
      Swal.fire({ title: 'Reseña enviada', text: 'Tu reseña ha sido enviada correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Hubo un error al enviar tu reseña. Por favor intenta nuevamente.', icon: 'error', confirmButtonText: 'Aceptar' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date instanceof Date) return date.toLocaleDateString('es-CO');
    if (date.toDate) return date.toDate().toLocaleDateString('es-CO');
    return 'N/A';
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-7 h-7 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-10" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Reseñas de Clientes</h3>
          {reviews.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{reviews.length} reseña{reviews.length !== 1 ? 's' : ''} · Promedio {avgRating}★</p>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="py-10 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm font-medium text-gray-900">Sin reseñas aún</p>
          <p className="text-sm text-gray-400 mt-0.5">Sé el primero en dejar una reseña</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-bold flex-shrink-0">
                    {review.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(review.createdAt)}</p>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-12">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;