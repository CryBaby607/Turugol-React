import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatusAndRole from '../hooks/useAuthStatusAndRole';

const ProtectedRoute = ({ requiredRole }) => {
    // 1. Obtenemos también 'loadingRole' del hook
    const { user, authReady, role, loadingRole } = useAuthStatusAndRole();

    // 2. Si la autenticación no está lista O el rol se está buscando en la BD, mostramos carga
    // Esto evita que te redirija mientras verifica quién eres.
    if (!authReady || loadingRole) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 3. Si no hay usuario logueado, al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 4. Si se requiere un rol específico (ej: 'admin') y el usuario no lo tiene, al Home
    if (requiredRole && role !== requiredRole) {
        console.warn(`Acceso denegado. Rol requerido: ${requiredRole}, Rol actual: ${role}`);
        return <Navigate to="/" replace />;
    }

    // 5. Todo correcto, renderiza la ruta hija
    return <Outlet />;
};

export default ProtectedRoute;