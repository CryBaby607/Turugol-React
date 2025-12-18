import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserDashboardPage from './pages/user/Dashboard'; 
import AdminDashboardPage from './pages/admin/Dashboard';
import CreateQuiniela from './pages/admin/CreateQuiniela';
import SchedulePageWithLayout from './pages/admin/FootballSchedule';
import AvailableQuinielas from './pages/user/AvailableQuinielas';
import UserManagement from './pages/admin/UserManagement';
import ManageQuinielas from './pages/admin/ManageQuinielas'; 

import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
    return (
        <div className="App">
            <Routes>
                {/* 1. RUTAS PÚBLICAS */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 2. RUTAS DE USUARIO */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard/user" element={<UserDashboardPage />} />
                    <Route path="/dashboard/user/avaliblequinelas" element={<AvailableQuinielas />} /> 
                    <Route path="/dashboard/user/history" element={<UserDashboardPage />} />
                </Route>

                {/* 3. RUTAS DE ADMIN */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
                    
                    {/* Gestión de usuarios */}
                    <Route path="/dashboard/admin/users" element={<UserManagement />} /> 
                    
                    {/* Crear nueva quiniela */}
                    <Route path="/dashboard/admin/create" element={<CreateQuiniela />} />
                    
                    {/* 2. AÑADIR LA RUTA FALTANTE AQUÍ */}
                    <Route path="/dashboard/admin/manage" element={<ManageQuinielas />} />

                    {/* Calendario */}
                    <Route path="/dashboard/admin/schedule" element={<SchedulePageWithLayout />} />
                </Route>
                
                <Route path="*" element={<Home />} /> 
            </Routes>
        </div>
    );
}

export default App;