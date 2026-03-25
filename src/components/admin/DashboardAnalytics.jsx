import React from 'react';
import Loader from '../Loader';
import SalesTrendChart from '../charts/SalesTrendChart';
import SalesByCategoryChart from '../charts/SalesByCategoryChart';
import OrderStatusChart from '../charts/OrderStatusChart';
import PaymentMethodChart from '../charts/PaymentMethodChart';
import UserRegistrationChart from '../charts/UserRegistrationChart';
import { FiShoppingBag, FiPackage, FiUsers, FiBarChart2 } from 'react-icons/fi';

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
    return <Loader text="Cargando datos analíticos..." size="lg" />;
  }

  // Stylish glassmorphism card classes
  const cardClass = `p-6 transition-all duration-300 backdrop-blur-md bg-white/80 shadow-lg border border-gray-100 rounded-3xl ${
    theme === 'dark' ? 'dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-2xl' : ''
  } w-full`;

  const btnClassActive = "px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transform hover:scale-105 transition-all duration-200";
  const btnClassInactive = `px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
    theme === 'dark' ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600' : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-transparent'
  }`;

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Date Range Selector */}
      <div className={`${cardClass} flex flex-wrap items-center justify-between gap-4`}>
        <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
          Visión General
        </h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleDateRangeChange('last7days')}
            className={stats.dateRange === 'last7days' ? btnClassActive : btnClassInactive}
          >
            Últimos 7 días
          </button>
          <button 
            onClick={() => handleDateRangeChange('last30days')}
            className={stats.dateRange === 'last30days' ? btnClassActive : btnClassInactive}
          >
            Últimos 30 días
          </button>
          <button 
            onClick={() => handleDateRangeChange('last90days')}
            className={stats.dateRange === 'last90days' ? btnClassActive : btnClassInactive}
          >
            Últimos 90 días
          </button>
          <button 
            onClick={() => handleDateRangeChange('lastYear')}
            className={stats.dateRange === 'lastYear' ? btnClassActive : btnClassInactive}
          >
            Último año
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Productos', value: stats.totalProducts, icon: FiShoppingBag, colorId: 'blue', themeColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600', bgIcon: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100' },
          { label: 'Total Pedidos', value: stats.totalOrders, icon: FiPackage, colorId: 'green', themeColor: theme === 'dark' ? 'text-green-400' : 'text-green-600', bgIcon: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100' },
          { label: 'Total Usuarios', value: stats.totalUsers, icon: FiUsers, colorId: 'purple', themeColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600', bgIcon: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100' },
          { label: 'Ingresos Totales', value: formatCurrency(stats.totalRevenue), icon: FiBarChart2, colorId: 'indigo', themeColor: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600', bgIcon: theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100' },
        ].map((metric, idx) => (
          <div key={idx} className={`${cardClass} hover:-translate-y-1 transform transition-all duration-300 group`}>
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl ${metric.bgIcon} group-hover:scale-110 transition-transform`}>
                <metric.icon className={`${metric.themeColor}`} size={28} />
              </div>
              <div className="ml-5">
                <p className={`text-sm font-semibold tracking-wide uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                <p className={`mt-1 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <div className={cardClass}>
          <h3 className={`mb-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Tendencia de Ventas</h3>
          <div className="w-full h-80">
            <SalesTrendChart data={stats.salesData} theme={theme} />
          </div>
        </div>
        
        <div className={cardClass}>
          <h3 className={`mb-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Ventas por Categoría</h3>
          <div className="w-full h-80">
            <SalesByCategoryChart data={stats.salesByCategory} theme={theme} />
          </div>
        </div>
        
        <div className={cardClass}>
          <h3 className={`mb-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Distribución de Estados de Pedido</h3>
          <div className="w-full h-80">
            <OrderStatusChart data={stats.orderStatusData} theme={theme} />
          </div>
        </div>
        
        <div className={cardClass}>
          <h3 className={`mb-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Ingresos por Método de Pago</h3>
          <div className="w-full h-80">
            <PaymentMethodChart data={stats.paymentMethodData} theme={theme} />
          </div>
        </div>
      </div>
      
      {/* Tables Section */}
      <div className="grid w-full grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Top Selling Products */}
        <div className={`${cardClass} overflow-hidden`}>
          <h3 className={`mb-6 text-xl font-bold px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Productos Más Vendidos</h3>
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className={theme === 'dark' ? 'bg-slate-800/90' : 'bg-gray-50/90'}>
                <tr>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Producto</th>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Cantidad</th>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Ingresos</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-100'} bg-transparent`}>
                {stats.topSellingProducts.map((product, index) => (
                  <tr key={index} className={`transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50/80'}`}>
                    <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {product.productName}
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {product.quantity}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className={`${cardClass} overflow-hidden`}>
          <h3 className={`mb-6 text-xl font-bold px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Pedidos Recientes</h3>
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className={theme === 'dark' ? 'bg-slate-800/90' : 'bg-gray-50/90'}>
                <tr>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>ID / Fecha</th>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Cliente</th>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Total</th>
                  <th className={`px-6 py-4 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Estado</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-100'} bg-transparent`}>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className={`transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50/80'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{order.id.substring(0, 8)}...</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(order.createdAt)}</div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{order.userEmail || 'N/A'}</td>
                    <td className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{formatCurrency(order.totalAmount || 0)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap`}>
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getStatusBadgeClass(order.orderStatus || 'pending', theme)}`}>
                        {getOrderStatusText(order.orderStatus || 'pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* User Registration Trend */}
      <div className={cardClass}>
        <h3 className={`mb-6 text-xl font-bold px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Crecimiento de Usuarios</h3>
        <div className="w-full h-80">
          <UserRegistrationChart data={stats.userRegistrationData} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
