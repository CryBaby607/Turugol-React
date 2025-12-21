import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // 1. Importar useLocation
import { useAuthStatusAndRole } from '../hooks/useAuthStatusAndRole';

const ProtectedRoute = ({ requiredRole }) => {
    const { loggedIn, checkingStatus, role } = useAuthStatusAndRole();
    const location = useLocation(); // 2. Obtener la ubicación actual

    if (checkingStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-circle-notch fa-spin text-blue-600 text-3xl mb-3"></i>
                    <p className="text-gray-500 font-medium">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!loggedIn) {
        // 3. Pasar la ubicación en el "state" para recordarla
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;