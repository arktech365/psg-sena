import React from 'react';
import Loader from '../Loader';
import { FiUsers, FiEdit, FiSearch, FiShield } from 'react-icons/fi';

const AdminUsers = ({
  users,
  usersLoading,
  userSearchTerm,
  setUserSearchTerm,
  userRoleFilter,
  setUserRoleFilter,
  theme,
  updateUserRole
}) => {
  if (usersLoading) {
    return <Loader text="Cargando usuarios..." size="lg" />;
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !userSearchTerm || 
      (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(userSearchTerm.toLowerCase()));
    
    const matchesRole = userRoleFilter === 'all' || 
      (userRoleFilter === 'admin' && user.role === 'admin') ||
      (userRoleFilter === 'user' && user.role === 'user');
    
    return matchesSearch && matchesRole;
  });

  const cardClass = `p-6 transition-all duration-300 backdrop-blur-md bg-white/80 shadow-xl border border-gray-100 rounded-3xl ${
    theme === 'dark' ? 'dark:bg-slate-800/80 dark:border-slate-700/50 dark:shadow-2xl' : ''
  } w-full`;

  return (
    <div className={`${cardClass} animate-fadeIn`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'}`}>
            Gestión de Usuarios
          </h2>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Administra los roles y cuentas registradas
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
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
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-medium ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' 
                : 'bg-white border-gray-200 text-gray-800 focus:bg-gray-50'
            }`}
          >
            <option value="all">Todos</option>
            <option value="admin">Administradores</option>
            <option value="user">Clientes</option>
          </select>
        </div>
      </div>
      
      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-slate-700/50">
            <thead className={theme === 'dark' ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-gray-50/90 backdrop-blur-sm'}>
              <tr>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Usuario</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-left uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Rol</th>
                <th className={`px-6 py-5 text-xs font-bold tracking-wider text-right uppercase ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-slate-700/40 bg-transparent' : 'hover:bg-blue-50/30 bg-transparent'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                        theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center text-xs font-bold rounded-full border ${
                      user.role === 'admin' 
                        ? theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                        : theme === 'dark' ? 'bg-slate-700 text-gray-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {user.role === 'admin' && <FiShield className="mr-1" />}
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')} 
                        className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center text-xs font-semibold ${
                          theme === 'dark' 
                            ? 'bg-slate-700 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 border border-slate-600 hover:border-emerald-500/50' 
                            : 'bg-white text-emerald-600 hover:bg-emerald-50 hover:scale-105 border border-gray-200 hover:border-emerald-300'
                        }`}
                        title="Cambiar rol"
                      >
                        <FiEdit className="mr-1.5" size={14} />
                        {user.role === 'admin' ? 'Hacer Cliente' : 'Hacer Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <FiUsers size={32} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">
                {userSearchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
