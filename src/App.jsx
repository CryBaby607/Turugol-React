import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

// Importar Layouts Nuevos
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Usuario Pages
import UserDashboardPage from './pages/user/Dashboard'; 
import AvailableQuinielas from './pages/user/AvailableQuinielas';
import PlayQuiniela from './pages/user/PlayQuiniela'; 
import UserHistory from './pages/user/UserHistory';   
import UserProfile from './pages/user/UserProfile';   
import Leaderboard from './pages/user/Leaderboard';

// Admin Pages
import AdminDashboardPage from './pages/admin/Dashboard';
import CreateQuiniela from './pages/admin/CreateQuiniela';
import ManageQuinielas from './pages/admin/ManageQuinielas'; 
import UserManagement from './pages/admin/UserManagement';

import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
    return (
        <div className="App">
            <Routes>
                {/* 1. RUTAS PÚBLICAS */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 2. RUTAS DE USUARIO (Layout Usuario) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<UserLayout />}>
                        <Route path="/dashboard/user" element={<UserDashboardPage />} />
                        <Route path="/dashboard/user/available-quinielas" element={<AvailableQuinielas />} /> 
                        <Route path="/dashboard/user/play/:quinielaId" element={<PlayQuiniela />} />
                        <Route path="/dashboard/user/history" element={<UserHistory />} />
                        <Route path="/dashboard/user/profile" element={<UserProfile />} />
                        <Route path="/dashboard/user/leaderboard/:quinielaId" element={<Leaderboard />} />
                    </Route>
                </Route>

                {/* 3. RUTAS DE ADMIN (Layout Admin) */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
                        <Route path="/dashboard/admin/create" element={<CreateQuiniela />} />
                        <Route path="/dashboard/admin/manage" element={<ManageQuinielas />} />
                        <Route path="/dashboard/admin/users" element={<UserManagement />} /> 
                    </Route>
                </Route>
                
                {/* 4. CATCH ALL */}
                <Route path="*" element={<Home />} /> 
            </Routes>
        </div>
    );
}

export default App;