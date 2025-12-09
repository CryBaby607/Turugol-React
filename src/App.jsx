import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Navbar from './components/Navbar/Navbar';
import AdminLayout from './layouts/AdminLayout';
import Footer from './components/Footer/Footer';

// Componentes Públicos (Reutilizamos lo que tenías)
import Hero from './components/Hero/Hero';
import ActivePoolsSection from './components/Sections/ActivePoolsSection';
import ClosedPoolsSection from './components/Sections/ClosedPoolsSection';
import MyParticipationsSection from './components/Sections/MyParticipationsSection';
import { QUINIELAS } from './data/quiniela'; // Mock Data

// Páginas Admin
import AdminDashboard from './pages/Admin/Dashboard';
import CreatePool from './pages/Admin/CreatePool'; // <--- FALTA ESTE ARCHIVO
import PoolsList from './pages/Admin/PoolsList';   // <--- FALTA ESTE ARCHIVO

// Componente para la Home Pública
const LandingPage = () => {
  // Aquí mantenemos tu lógica visual original para la home
  const activePools = QUINIELAS.filter(p => p.status === 'open');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdminMode={false} currentSection="activas" onSectionChange={() => {}} />
      <Hero />
      <section className="py-12 max-w-7xl mx-auto px-4">
        <ActivePoolsSection 
          pools={activePools} 
          onParticipate={(id) => console.log('Participar', id)} 
          isAdminMode={false} 
        />
      </section>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<LandingPage />} />

        {/* Rutas de Administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="quinielas" element={<PoolsList />} />
          <Route path="crear" element={<CreatePool />} />
          
          {/* Placeholders para rutas futuras */}
          <Route path="partidos" element={<div>Gestión de Partidos API (Próximamente)</div>} />
          <Route path="resultados" element={<div>Gestión de Resultados (Próximamente)</div>} />
          <Route path="participantes" element={<div>Lista de Participantes (Próximamente)</div>} />
          <Route path="configuracion" element={<div>Configuración (Próximamente)</div>} />
        </Route>

        {/* Redirección 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;