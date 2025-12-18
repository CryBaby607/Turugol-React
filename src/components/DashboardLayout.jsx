// src/components/DashboardLayout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = ({ isAdmin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Mantenemos la estructura exacta de tus objetos originales
    const links = isAdmin
        ? [
              { path: '/dashboard/admin', name: 'Resumen Admin', icon: 'fas fa-chart-line' },
              { path: '/dashboard/admin/create', name: 'Crear Quiniela', icon: 'fas fa-plus-circle' },
              { path: '/dashboard/admin/manage', name: 'Gestionar Quinielas', icon: 'fas fa-clipboard-list' },
              { path: '/dashboard/admin/users', name: 'Gestionar Usuarios', icon: 'fas fa-users' }, 
          ]
        : [
              { path: '/dashboard/user', name: 'Mis Quinielas', icon: 'fas fa-trophy' },
              { path: '/dashboard/user/avaliblequinelas', name: 'Quinielas Disponibles', icon: 'fas fa-clipboard-list' }, 
              { path: '/dashboard/user/profile', name: 'Mi Perfil', icon: 'fas fa-user-circle' },
              { path: '/dashboard/user/history', name: 'Historial', icon: 'fas fa-history' },
          ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg min-h-screen">
            <div className="flex items-center space-x-3 mb-8 px-2">
                <i className="fas fa-futbol text-2xl text-green-400"></i>
                <span className="text-xl font-bold tracking-wider">TURUGOL</span>
            </div>
            
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                    location.pathname === link.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <i className={`${link.icon} w-5`}></i>
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-700">
                <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full text-left"
                >
                    <i className="fas fa-sign-out-alt w-5"></i>
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

const DashboardLayout = ({ children, isAdmin }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar isAdmin={isAdmin} />
            <div className="flex-grow flex flex-col">
                <header className="bg-white shadow-sm p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {isAdmin ? "Panel de Administrador" : "Panel de Usuario"}
                    </h1>
                </header>
                
                <main className="flex-grow p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;