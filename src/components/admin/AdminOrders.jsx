import React from 'react';
import Loader from '../Loader';
import { FiPackage, FiShoppingBag, FiTrash2, FiSearch, FiTruck, FiRefreshCw, FiExternalLink } from 'react-icons/fi';

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Rastreando Logística...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  const filteredOrders = orderSearchTerm
    ? orders.filter(order =>
        (order.id && order.id.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
        (order.orderStatus && order.orderStatus.toLowerCase().includes(orderSearchTerm.toLowerCase()))
      )
    : orders;

  // Luxury UI Tokens
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filter Zone */}
      <div className={`${bgCard} p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Logistics Control</span>
          </div>
          <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${textTitle}`}>Flujo de Pedidos</h2>
          <p className={`${textSub} mt-1 text-xs md:text-sm`}>Supervisa el ciclo de vida de cada venta, desde el pago hasta la entrega final.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <div className="relative w-full md:w-80 group">
            <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Orders Content Table / Cards */}
      <div className={`${bgCard} rounded-3xl md:rounded-[2.5rem] border overflow-hidden`}>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} border-b border-inherit`}>
                <th className="px-10 py-6">Pedido & Comprador</th>
                <th className="px-10 py-6">Fecha Venta</th>
                <th className="px-10 py-6">Valor Total</th>
                <th className="px-10 py-6">Estado Logístico</th>
                <th className="px-10 py-6 text-right pr-14">Detalles</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
              {filteredOrders.map((o) => (
                <tr key={o.id} className="group hover:bg-slate-500/5 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner ${
                        isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                         <FiPackage size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black text-sm tracking-tight ${textTitle}`}>{o.userEmail || 'Invitado'}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ORD-{o.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${textSub}`}>
                      {formatDate(o.createdAt)}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`font-black text-base text-emerald-500`}>
                      {formatCurrency(o.totalAmount || 0)}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusBadgeClass(o.orderStatus, theme)} shadow-sm`}>
                        <FiTruck size={10} /> {getOrderStatusText(o.orderStatus)}
                      </div>
                      
                      {orderStatusUpdating[o.id] ? (
                        <FiRefreshCw className="animate-spin text-slate-400" size={12} />
                      ) : (
                        <select
                          value={o.orderStatus || 'pending'}
                          onChange={(e) => updateOrderStatusHandler(o.id, e.target.value)}
                          className={`text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-1 outline-none transition-all ${
                            isDark ? 'bg-slate-800 border-slate-700 text-slate-400 focus:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 focus:bg-white'
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
                  <td className="px-10 py-6 text-right pr-14">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openOrderDetails(o)} 
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white' : 'bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                        title="Ver Detalles"
                      >
                        <FiExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => deleteOrder(o.id)} 
                        className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white' : 'bg-slate-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                        title="Eliminar Registro"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/10">
          {filteredOrders.map((o) => (
            <div key={o.id} className="p-6 space-y-4 hover:bg-indigo-500/5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                    isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                     <FiPackage size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className={`font-black text-sm block truncate tracking-tight ${textTitle}`}>{o.userEmail || 'Invitado'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ORD-{o.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${textSub} shrink-0`}>
                  {formatDate(o.createdAt)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Monto Total</p>
                  <span className={`font-black text-lg text-emerald-500`}>
                    {formatCurrency(o.totalAmount || 0)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Estado</p>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusBadgeClass(o.orderStatus, theme)} shadow-sm`}>
                    {getOrderStatusText(o.orderStatus)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-500/10">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest min-w-[50px]">Status:</span>
                   {orderStatusUpdating[o.id] ? (
                    <FiRefreshCw className="animate-spin text-indigo-500" size={16} />
                  ) : (
                    <select
                      value={o.orderStatus || 'pending'}
                      onChange={(e) => updateOrderStatusHandler(o.id, e.target.value)}
                      className={`flex-1 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 bg-slate-500/5 border-none outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => openOrderDetails(o)} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
                  >
                    <FiExternalLink size={16} /> Detalles
                  </button>
                  <button 
                    onClick={() => deleteOrder(o.id)} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800/50 text-rose-400' : 'bg-rose-50 text-rose-600'}`}
                  >
                    <FiTrash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="py-24 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <FiPackage size={32} className="opacity-20" />
            </div>
            <h3 className={`text-lg font-black ${textTitle}`}>Sin órdenes registradas</h3>
            <p className={`${textSub} text-sm mt-2`}>No hay transacciones que coincidan con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
