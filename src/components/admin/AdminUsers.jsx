import React from 'react';
import Loader from '../Loader';
import { FiUsers, FiEdit3, FiSearch, FiShield, FiUser, FiActivity, FiKey } from 'react-icons/fi';

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Verificando Credenciales...</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  const filteredUsers = users.filter(user => {
    const matchesSearch = !userSearchTerm || 
      (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(userSearchTerm.toLowerCase()));
    
    const matchesRole = userRoleFilter === 'all' || 
      (userRoleFilter === 'admin' && user.role === 'admin') ||
      (userRoleFilter === 'user' && user.role === 'user');
    
    return matchesSearch && matchesRole;
  });

  // Luxury UI Tokens
  const bgCard = isDark ? 'bg-[#1a1b26] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm';
  const textTitle = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filters Zone */}
      <div className={`${bgCard} p-8 md:p-10 rounded-[2.5rem] border flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600`}>Identity Management</span>
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${textTitle}`}>Directorio de Usuarios</h2>
          <p className={`${textSub} mt-1 text-sm`}>Controla los niveles de acceso y gestiona la comunidad de PSG Shop.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <div className="relative w-full md:w-80 group">
            <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
            <input
              type="text"
              placeholder="Buscar por email o rol..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 ${
                isDark ? 'bg-slate-900/50 border-slate-700 focus:ring-indigo-500/20 text-white' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/10 text-slate-900'
              }`}
            />
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
            className={`px-6 py-4 rounded-2xl border transition-all duration-300 outline-none focus:ring-4 font-bold text-xs uppercase tracking-widest ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 focus:ring-indigo-500/20' : 'bg-white border-slate-200 text-slate-700 focus:ring-indigo-500/10'
            }`}
          >
            <option value="all">Ver Todos</option>
            <option value="admin">Administradores</option>
            <option value="user">Clientes</option>
          </select>
        </div>
      </div>

      {/* Users Table Card */}
      <div className={`${bgCard} rounded-[2.5rem] border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} border-b border-inherit`}>
                <th className="px-10 py-6">Perfil de Usuario</th>
                <th className="px-10 py-6">Nivel de Acceso</th>
                <th className="px-10 py-6">Estado Cuenta</th>
                <th className="px-10 py-6 text-right pr-14">Ajustes de Rango</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/10' : 'divide-slate-50'}`}>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-500/5 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner ${
                        isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {u.email?.charAt(0).toUpperCase() || <FiUser/>}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black text-sm tracking-tight ${textTitle}`}>{u.email}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">UID: {u.id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.role === 'admin' 
                        ? isDark ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
                      {u.role === 'admin' ? 'Master Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${textSub}`}>Activo</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right pr-14">
                    <button 
                      onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')} 
                      className={`px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ml-auto text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        isDark 
                          ? 'bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white' 
                          : 'bg-white text-slate-700 hover:bg-black hover:text-white border border-slate-100'
                      }`}
                    >
                      <FiKey size={14} className="opacity-50" />
                      {u.role === 'admin' ? 'Degradar Rango' : 'Elevar a Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-24 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <FiUsers size={32} className="opacity-20" />
              </div>
              <h3 className={`text-lg font-black ${textTitle}`}>Usuarios no encontrados</h3>
              <p className={`${textSub} text-sm mt-2`}>No hay registros que coincidan con los criterios de búsqueda actuales.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
