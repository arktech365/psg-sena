import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getOrdersByUserId } from '../../services/orderService';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import { createReview, getUserReviewForProduct, updateReview, deleteReview } from '../../services/reviewService';
import Swal from 'sweetalert2';

const Orders = () => {
  const { currentUser } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  const getPrimaryImageUrl = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const valid = product.imageUrls.filter(img => img && (typeof img === 'string' || (img.data && typeof img.data === 'string')));
      if (valid.length > 0) {
        const safe = Math.min(product.primaryImageIndex || 0, valid.length - 1);
        const img = valid[safe];
        if (typeof img === 'string') return img;
        if (img && img.data) return img.data;
      }
    }
    return product.imageUrl || 'https://via.placeholder.com/100x100.png?text=PSG';
  };

  const [orders, setOrders] = useState([]);
  const [productImages, setProductImages] = useState({}); // Cache para imágenes faltantes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);

  const getOrderStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'shipped': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date instanceof Date) return date.toLocaleDateString('es-CO');
    if (date.toDate) return date.toDate().toLocaleDateString('es-CO');
    return 'N/A';
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount || 0);

  const openOrderDetails = (order) => { setSelectedOrder(order); setIsModalOpen(true); };
  const closeOrderDetails = () => { setIsModalOpen(false); setSelectedOrder(null); };

  const openReviewForm = async (product) => {
    try {
      const existingReview = await getUserReviewForProduct(currentUser.uid, product.id);
      if (existingReview) {
        setReviewingProduct({ id: existingReview.id, productId: product.id, productName: product.name, rating: existingReview.rating, comment: existingReview.comment, isEditing: true });
      } else {
        setReviewingProduct({ productId: product.id, productName: product.name, rating: 0, comment: '', isEditing: false });
      }
    } catch (error) {
      setReviewingProduct({ productId: product.id, productName: product.name, rating: 0, comment: '', isEditing: false });
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => setReviewingProduct(prev => ({ ...prev, rating }));

  const submitReview = async () => {
    if (reviewingProduct.rating === 0) { Swal.fire({ title: 'Error', text: 'Por favor selecciona una calificación', icon: 'error', confirmButtonText: 'Aceptar' }); return; }
    if (reviewingProduct.comment.trim() === '') { Swal.fire({ title: 'Error', text: 'Por favor escribe un comentario', icon: 'error', confirmButtonText: 'Aceptar' }); return; }
    try {
      const reviewData = { productId: reviewingProduct.productId, userId: currentUser.uid, userEmail: currentUser.email, userName: currentUser.displayName || currentUser.email.split('@')[0], rating: reviewingProduct.rating, comment: reviewingProduct.comment.trim() };
      if (reviewingProduct.isEditing) {
        await updateReview(reviewingProduct.id, reviewData);
        Swal.fire({ title: 'Reseña actualizada', text: 'Tu reseña ha sido actualizada correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
      } else {
        await createReview(reviewData);
        Swal.fire({ title: 'Reseña enviada', text: 'Tu reseña ha sido enviada correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
      }
      setReviewingProduct(null);
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Hubo un error al procesar tu reseña. Por favor intenta nuevamente.', icon: 'error', confirmButtonText: 'Aceptar' });
    }
  };

  const deleteReviewHandler = async () => {
    if (!reviewingProduct || !reviewingProduct.isEditing) return;
    Swal.fire({ title: '¿Estás seguro?', text: 'Esta acción eliminará tu reseña permanentemente', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#6b7280', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar' }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteReview(reviewingProduct.id);
          Swal.fire({ title: 'Reseña eliminada', text: 'Tu reseña ha sido eliminada correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
          setReviewingProduct(null);
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'Hubo un error al eliminar tu reseña. Por favor intenta nuevamente.', icon: 'error', confirmButtonText: 'Aceptar' });
        }
      }
    });
  };

  useEffect(() => {
    // Check if coming from a successful payment (Universal detection for HashRouter or standard routes)
    const currentPath = window.location.hash || window.location.search;
    if (currentPath.includes('payment=success')) {
      // Find orderId in path
      const urlParams = new URLSearchParams(currentPath.split('?')[1]);
      const orderId = urlParams.get('orderId');
      
      const finalizeOrder = async () => {
        if (orderId) {
          try {
            await updateDoc(doc(db, 'orders', orderId), {
              paymentStatus: 'paid',
              updatedAt: new Date()
            });
          } catch (e) {
            console.error("Error updating order status:", e);
          }
        }
        clearCart();
        Swal.fire({
          title: '¡Pago Exitoso!',
          text: 'Tu pedido ha sido procesado correctamente con Stripe.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 5000
        });
        // Clean up the URL to avoid repeated alerts
        const cleanUrl = window.location.href.replace(/[?&]payment=success(&orderId=[\w-]+)?/, '');
        window.history.replaceState({}, document.title, cleanUrl);
        fetchUserOrders(); // Refresh list
      };

      finalizeOrder();
    }

    const fetchUserOrders = async () => {
      if (!currentUser) { navigate('/login'); return; }
      try {
        const orderList = await getOrdersByUserId(currentUser.uid);
        setOrders(orderList);
        
        // Cargar las imágenes de los productos que tengan imageUrl null
        const missingImgIds = [];
        orderList.forEach(order => {
          order.items?.forEach(item => {
            if (!item.imageUrl && item.id) {
              missingImgIds.push(item.id);
            }
          });
        });

        if (missingImgIds.length > 0) {
          const uniqueIds = [...new Set(missingImgIds)];
          const imagesMap = { ...productImages };
          
          for (const id of uniqueIds) {
            if (!imagesMap[id]) {
              try {
                const prodRef = doc(db, 'products', id);
                const prodSnap = await getDoc(prodRef);
                if (prodSnap.exists()) {
                  imagesMap[id] = getPrimaryImageUrl(prodSnap.data());
                }
              } catch (e) {
                console.warn(`No se pudo cargar imagen para producto ${id}`, e);
              }
            }
          }
          setProductImages(imagesMap);
        }
      } catch (err) {
        setError('No se pudieron cargar tus órdenes. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-10 mx-auto max-w-4xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mis Pedidos</h1>
            <p className="mt-1 text-sm text-gray-500">Consulta el estado de tus pedidos recientes</p>
          </div>
          {orders.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {orders.length} pedido{orders.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-gray-100 mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">No tienes pedidos</h3>
            <p className="mt-1 text-sm text-gray-500">Aún no has realizado ningún pedido.</p>
            <Link to="/shop" className="inline-flex items-center mt-6 px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-150">
              Comprar ahora
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:border-gray-300 transition-colors duration-150">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Pedido #{order.id.substring(0, 8).toUpperCase()}</h3>
                      <p className="text-xs text-gray-500">Realizado el {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.orderStatus)}`}>
                      {getOrderStatusText(order.orderStatus)}
                    </span>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    {[
                      { label: 'Total', value: formatCurrency(order.totalAmount) },
                      { label: 'Productos', value: `${order.items?.length || 0} ítem${(order.items?.length || 0) !== 1 ? 's' : ''}` },
                      { label: 'Método de Pago', value: order.paymentMethod || 'N/A' },
                      { label: 'Estado de Pago', value: order.paymentStatus || 'N/A' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Products */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Productos</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              <img
                                src={item.imageUrl || productImages[item.id] || 'https://via.placeholder.com/48x48.png?text=PSG'}
                                alt={item.name}
                                className="object-cover w-full h-full"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48x48.png?text=PSG'; }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Cant: {item.quantity} · {formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => openReviewForm(item)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-150 whitespace-nowrap flex-shrink-0"
                          >
                            Dejar reseña
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{reviewingProduct.isEditing ? 'Editar reseña' : 'Dejar una reseña'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{reviewingProduct.productName}</p>
              </div>
              <button onClick={() => setReviewingProduct(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">✕</button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Calificación</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => handleRatingClick(star)} className="text-2xl focus:outline-none transition-transform hover:scale-110">
                      {star <= reviewingProduct.rating ? <span className="text-yellow-400">★</span> : <span className="text-gray-300">☆</span>}
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    {reviewingProduct.rating > 0 ? `${reviewingProduct.rating}/5` : 'Selecciona una calificación'}
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="review-comment" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Comentario</label>
                <textarea
                  id="review-comment" name="comment" rows={4}
                  value={reviewingProduct.comment} onChange={handleReviewChange}
                  className="block w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Comparte tu experiencia con este producto..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                {reviewingProduct.isEditing && (
                  <button onClick={deleteReviewHandler} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Eliminar</button>
                )}
                <button onClick={() => setReviewingProduct(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button onClick={submitReview} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">
                  {reviewingProduct.isEditing ? 'Actualizar' : 'Enviar reseña'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder} isOpen={isModalOpen} onClose={closeOrderDetails}
        formatDate={formatDate} formatCurrency={formatCurrency}
        getOrderStatusText={getOrderStatusText} getStatusBadgeClass={getStatusBadge}
      />
    </div>
  );
};

export default Orders;