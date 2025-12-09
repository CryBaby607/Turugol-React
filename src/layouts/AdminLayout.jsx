import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { TEXTS } from '../../constants/texts';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/admin/pools', icon: 'fa-trophy', label: 'Mis Quinielas' },
    { path: '/admin/create', icon: 'fa-plus-circle', label: 'Crear Quiniela' },
    { path: '/admin/matches', icon: 'fa-futbol', label: 'Partidos API' },
    { path: '/admin/results', icon: 'fa-chart-bar', label: 'Resultados' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Dinámico */}
      <div className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-purple-700 p-2 rounded-lg">
              <i className="fas fa-crown text-xl"></i>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold">Admin</h1>
                <p className="text-xs text-gray-400">Turugol</p>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                    location.pathname === item.path ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <i className={`fas ${item.icon} w-6 text-center`}></i>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-gray-800">
           {!collapsed ? (
             <div className="flex items-center space-x-3">
               <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">A</div>
               <div>
                 <p className="text-sm font-bold">Admin</p>
                 <p className="text-xs text-gray-400">Online</p>
               </div>
             </div>
           ) : (
             <div className="w-8 h-8 rounded-full bg-purple-500 mx-auto flex items-center justify-center">A</div>
           )}
        </div>
      </div>

      {/* Contenido Principal (Outlet renderiza las páginas hijas) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Panel de Control</h2>
          <div className="flex space-x-4">
             <button className="text-gray-600 hover:text-purple-600"><i className="fas fa-bell"></i></button>
             <Link to="/" className="text-gray-600 hover:text-purple-600"><i className="fas fa-external-link-alt"></i></Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;