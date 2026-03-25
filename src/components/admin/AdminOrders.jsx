import React from 'react';
import Loader from '../Loader';
import { FiPackage, FiShoppingBag, FiTrash2, FiSearch } from 'react-icons/fi';

const AdminOrders = ({
  orders,
  ordersLoading,
  orderSearchTerm,
  setOrderSearchTerm,
  theme,
  formatDate,
  formatCurrency,
  getStatusBadgeClass,
  getOrderStatusText,
  orderStatusUpdating,
  updateOrderStatusHandler,
  openOrderDetails,
  deleteOrder
}) => {
  if (ordersLoading) {
    return <Loader text="Cargando pedidos..." size="lg" />;
  }

  const filteredOrders = orderSearchTerm
    ? orders.filter(order =>
        (order.id && order.id.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
        (order.orderStatus && order.orderStatus.toLowerCase().includes(orderSearchTerm.toLowerCase()))
      )
    : orders;

  const cardClass = `p-6 transition-all duration-300 backdrop-blur-md bg-white/80 shadow-xl border border-gray-100 rounded-3xl ${
    theme === 'dark' ? 'dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-2xl' : ''
  } w-full`;

  return (
    <div className={`${cardClass} animate-fadeIn`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
            Pedidos Recientes
          </h2>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Gestiona envíos, entregas y cancelaciones
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <input
              type="text"
              placeholder="Buscar pedidos (ID, email)..."
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
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
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Cliente & ID</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Fecha</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Total</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Estado</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-right uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-slate-700/40 bg-transparent' : 'hover:bg-blue-50/30 bg-transparent'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} mr-4`}>
                        <FiPackage size={20} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {order.userEmail || 'N/A'}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          ID: {order.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{formatDate(order.createdAt)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(order.totalAmount || 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getStatusBadgeClass(order.orderStatus, theme)}`}>
                        {getOrderStatusText(order.orderStatus)}
                      </span>
                      {orderStatusUpdating[order.id] ? (
                        <div className={`w-4 h-4 border-b-2 rounded-full animate-spin ${
                          theme === 'dark' ? 'border-gray-400' : 'border-gray-900'
                        }`}></div>
                      ) : (
                        <select
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => updateOrderStatusHandler(order.id, e.target.value)}
                          className={`text-xs rounded-lg px-2 py-1 font-medium transition-colors border ${
                            theme === 'dark' 
                              ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-2 focus:ring-blue-500' 
                              : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500'
                          }`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => openOrderDetails(order)} 
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-110' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110'
                        }`}
                        title="Ver detalles"
                      >
                        <FiShoppingBag size={16} />
                      </button>
                      <button 
                        onClick={() => deleteOrder(order.id)} 
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110'
                        }`}
                        title="Eliminar pedido"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <FiPackage size={32} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">
                {orderSearchTerm ? 'No se encontraron pedidos' : 'No hay pedidos disponibles'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
