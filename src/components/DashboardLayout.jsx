import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = ({ isAdmin, isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
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
        <>
            {/* Overlay para móviles */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between mb-8 px-2">
                    <span className="text-xl font-bold tracking-wider">
                        TURU<span className="text-emerald-500">GOL</span>
                    </span>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {links.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
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
        </>
    );
};

const DashboardLayout = ({ children, isAdmin }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                isAdmin={isAdmin} 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />
            
            <div className="flex-grow flex flex-col min-w-0">
                {/* Header solo visible en móvil para el menú hamburguesa */}
                <header className="bg-white shadow-sm p-4 border-b border-gray-200 flex items-center lg:hidden">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </header>
                
                <main className="flex-grow p-4 md:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;