import React from 'react';
import Loader from '../Loader';
import SalesTrendChart from '../charts/SalesTrendChart';
import SalesByCategoryChart from '../charts/SalesByCategoryChart';
import OrderStatusChart from '../charts/OrderStatusChart';
import PaymentMethodChart from '../charts/PaymentMethodChart';
import UserRegistrationChart from '../charts/UserRegistrationChart';
import { FiShoppingBag, FiPackage, FiUsers, FiBarChart2, FiActivity, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const DashboardAnalytics = ({
  stats,
  loading,
  theme,
  handleDateRangeChange,
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
  getOrderStatusText
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600 animate-pulse">Sincronizando Inteligencia...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  
  // Luxury UI Tokens
  const bgMain = isDark ? 'bg-[#111218]' : 'bg-slate-50';
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  const btnBase = "px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 active:scale-95";
  const btnActive = `${btnBase} bg-indigo-600 text-white shadow-lg shadow-indigo-500/20`;
  const btnInactive = `${btnBase} ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'}`;

  return (
    <div className={`w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ${bgMain}`}>
      
      {/* Dynamic Header & Period Selector */}
      <div className={`${bgCard} p-10 rounded-[2.5rem] border flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Intelligence Center</span>
          </div>
          <h2 className={`text-4xl font-black tracking-tight ${textTitle}`}>Análisis Proyectivo</h2>
          <p className={`${textSub} mt-1 text-base`}>Visualiza el rendimiento y crecimiento de tu ecosistema comercial.</p>
        </div>

        <div className="flex flex-wrap gap-3 relative">
          {[
            { id: 'last7days', label: '7 Días' },
            { id: 'last30days', label: '30 Días' },
            { id: 'last90days', label: '90 Días' },
            { id: 'lastYear', label: 'Anual' },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => handleDateRangeChange(period.id)}
              className={stats.dateRange === period.id ? btnActive : btnInactive}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Premium KPI Grid */}
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Productos', value: stats.totalProducts, icon: FiShoppingBag, color: 'blue', desc: 'Catálogo total' },
          { label: 'Pedidos', value: stats.totalOrders, icon: FiPackage, color: 'emerald', desc: 'Flujo de ventas' },
          { label: 'Comunidad', value: stats.totalUsers, icon: FiUsers, color: 'purple', desc: 'Usuarios registrados' },
          { label: 'Ingresos', value: formatCurrency(stats.totalRevenue), icon: FiTrendingUp, color: 'indigo', desc: 'Valor total bruto' },
        ].map((metric, idx) => (
          <div key={idx} className={`${bgCard} p-8 rounded-[2rem] border group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}>
            <div className={`absolute bottom-0 right-0 w-24 h-24 bg-${metric.color}-500/5 rounded-full -mb-12 -mr-12 blur-2xl group-hover:scale-150 transition-transform`}></div>
            <div className="flex flex-col gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metric.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : metric.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : metric.color === 'purple' ? 'bg-purple-500/10 text-purple-500' : 'bg-indigo-500/10 text-indigo-500'} shadow-inner`}>
                <metric.icon size={26} />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} mb-1`}>{metric.label}</p>
                <h4 className={`text-2xl font-black tracking-tight ${textTitle}`}>{metric.value}</h4>
                <p className="text-[10px] text-slate-400 mt-2 font-medium opacity-60 flex items-center gap-1">
                   {metric.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Architecture */}
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
        <div className={`${bgCard} p-10 rounded-[2.5rem] border`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${textTitle}`}>Tendencia de Ingresos</h3>
            <FiActivity className="text-indigo-500 opacity-50" size={20} />
          </div>
          <div className="w-full h-80">
            <SalesTrendChart data={stats.salesData} theme={theme} />
          </div>
        </div>
        
        <div className={`${bgCard} p-10 rounded-[2.5rem] border`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${textTitle}`}>Dominio de Categorías</h3>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest">Share %</div>
          </div>
          <div className="w-full h-80">
            <SalesByCategoryChart data={stats.salesByCategory} theme={theme} />
          </div>
        </div>
        
        <div className={`${bgCard} p-10 rounded-[2.5rem] border`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${textTitle}`}>Flujo de Operaciones</h3>
            <span className={textSub}><FiPackage/></span>
          </div>
          <div className="w-full h-80">
            <OrderStatusChart data={stats.orderStatusData} theme={theme} />
          </div>
        </div>
        
        <div className={`${bgCard} p-10 rounded-[2.5rem] border`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${textTitle}`}>Capital por Canal</h3>
            <span className={textSub}><FiBarChart2/></span>
          </div>
          <div className="w-full h-80">
            <PaymentMethodChart data={stats.paymentMethodData} theme={theme} />
          </div>
        </div>
      </div>
      
      {/* Advanced Intelligence Tables */}
      <div className="grid w-full grid-cols-1 gap-10 xl:grid-cols-2">
        
        {/* Top Products Card */}
        <div className={`${bgCard} rounded-[2.5rem] border overflow-hidden`}>
          <div className="px-10 py-8 border-b border-inherit flex items-center justify-between">
            <h3 className={`text-xl font-black tracking-tight ${textTitle}`}>Performance de Productos</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2 hover:gap-3 transition-all">Ver todos <FiArrowRight/></button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub}`}>
                  <th className="px-8 py-6">Producto Estrella</th>
                  <th className="px-8 py-6">Volumen</th>
                  <th className="px-8 py-6 text-right pr-12">Valor Bruto</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
                {stats.topSellingProducts.map((p, idx) => (
                  <tr key={idx} className="group hover:bg-slate-500/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-slate-500/5 flex items-center justify-center font-black text-xs ${textSub}`}>{idx + 1}</div>
                        <span className={`font-bold text-sm ${textTitle} tracking-tight`}>{p.productName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{p.quantity} uds</span>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <span className={`font-black text-sm text-emerald-500`}>{formatCurrency(p.revenue)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Traffic Card */}
        <div className={`${bgCard} rounded-[2.5rem] border overflow-hidden`}>
          <div className="px-10 py-8 border-b border-inherit flex items-center justify-between">
            <h3 className={`text-xl font-black tracking-tight ${textTitle}`}>Monitoreo de Pedidos</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Flow</span>
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub}`}>
                  <th className="px-8 py-6">Identificador</th>
                  <th className="px-8 py-6">Cliente</th>
                  <th className="px-8 py-6 text-right pr-12">Total</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="group hover:bg-slate-500/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className={`font-black text-xs ${textTitle} tracking-widest`}>#{o.id.substring(0, 8).toUpperCase()}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{formatDate(o.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-bold ${textSub}`}>{o.userEmail || 'Guest Account'}</span>
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <div className="flex flex-col items-end">
                        <span className={`font-black text-sm ${textTitle}`}>{formatCurrency(o.totalAmount || 0)}</span>
                        <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 px-2 py-0.5 rounded-full border ${getStatusBadgeClass(o.orderStatus || 'pending', theme)}`}>
                          {getOrderStatusText(o.orderStatus || 'pending')}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Expansion Growth Chart */}
      <div className={`${bgCard} p-10 rounded-[2.5rem] border relative overflow-hidden`}>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className={`text-2xl font-black tracking-tight ${textTitle}`}>Tracción de Usuarios</h3>
            <p className={textSub}>Incremento de la base instalada en el tiempo.</p>
          </div>
          <div className="p-4 rounded-[1.5rem] bg-indigo-600/10 text-indigo-600">
            <FiActivity size={24} />
          </div>
        </div>
        <div className="w-full h-80">
          <UserRegistrationChart data={stats.userRegistrationData} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
