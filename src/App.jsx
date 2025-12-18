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
import UserManagement from './pages/admin/UserManagement'; // Página de gestión de usuarios

// 🛑 IMPORTAR EL COMPONENTE DE PROTECCIÓN
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
    return (
        <div className="App">
            <Routes>
                {/* ============================================================== */}
                {/* 1. RUTAS PÚBLICAS (ACCESIBLES POR TODOS) */}
                {/* ============================================================== */}
                <Route path="/" element={<Home />} />
                
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />


                {/* ============================================================== */}
                {/* 2. RUTAS PROTEGIDAS (REQUIEREN CUALQUIER AUTENTICACIÓN) */}
                {/* ============================================================== */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard/user" element={<UserDashboardPage />} />
                    <Route path="/dashboard/user/avaliblequinelas" element={<AvailableQuinielas />} /> 
                    <Route path="/dashboard/user/history" element={<UserDashboardPage />} />
                </Route>


                {/* ============================================================== */}
                {/* 3. RUTAS PROTEGIDAS POR ROL (REQUIEREN ROL 'admin') */}
                {/* ============================================================== */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    {/* Panel principal del Admin */}
                    <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
                    
                    {/* Rutas de gestión administrativa */}
                    <Route path="/dashboard/admin/users" element={<UserManagement />} /> 
                    <Route path="/dashboard/admin/create" element={<CreateQuiniela />} />
                    <Route path="/dashboard/admin/schedule" element={<SchedulePageWithLayout />} />
                </Route>
                
                {/* Manejo de rutas no encontradas */}
                <Route path="*" element={<Home />} /> 

            </Routes>
        </div>
    );
}

export default App;