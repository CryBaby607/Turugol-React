import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUTS ---
import Navbar from './components/Navbar/Navbar';
import AdminLayout from './layouts/AdminLayout';
import Footer from './components/Footer/Footer';

// --- COMPONENTES PÚBLICOS ---
import Hero from './components/Hero/Hero';
import Filters from './components/Filters/Filters';
import ActivePoolsSection from './components/Sections/ActivePoolsSection';
import ClosedPoolsSection from './components/Sections/ClosedPoolsSection';
import MyParticipationsSection from './components/Sections/MyParticipationsSection';

// --- PÁGINAS DE ADMINISTRACIÓN ---
import AdminDashboard from './pages/Admin/Dashboard';
import CreatePool from './pages/Admin/CreatePool';
import PoolsList from './pages/Admin/PoolsList';
import MatchesAPI from './pages/Admin/MatchesAPI';       // Asegúrate de crear este archivo
import ResultsManager from './pages/Admin/ResultsManager'; // Asegúrate de crear este archivo
import ParticipantsList from './pages/Admin/ParticipantsList'; // Asegúrate de crear este archivo

// --- DATOS Y CONSTANTES ---
import { QUINIELAS } from './data/quiniela';
import { POOL_STATUS } from './constants/routes';

/**
 * Componente LandingPage:
 * Contiene toda la lógica visual de la página de inicio que ya tenías.
 * (Filtros, Tabs de Activas/Cerradas, etc.)
 */
const LandingPage = () => {
  const [currentSection, setCurrentSection] = useState('activas');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedSort, setSelectedSort] = useState('deadline');
  // Nota: isAdminMode ya no se maneja aquí para la UI general, 
  // pero lo dejamos en false para la vista pública.

  /**
   * Lógica de filtrado original
   */
  const filteredPools = () => {
    let pools = QUINIELAS.filter(p => {
      if (currentSection === 'activas') return p.status === POOL_STATUS.OPEN;
      if (currentSection === 'cerradas') return p.status === POOL_STATUS.CLOSED;
      if (currentSection === 'participaciones') return p.id === 1 || p.id === 4; // Mock de mis participaciones
      return false;
    });

    // Filtrar por liga
    if (selectedLeague !== 'all') {
      pools = pools.filter(p => p.leagueCode === selectedLeague);
    }

    // Ordenar
    pools.sort((a, b) => {
      if (selectedSort === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (selectedSort === 'newest') return b.id - a.id;
      if (selectedSort === 'participants') return b.participants - a.participants;
      return 0;
    });

    return pools;
  };

  const handleParticipate = (poolId) => {
    console.log('Abrir modal de participación para:', poolId);
    // Aquí iría la lógica para abrir el Modal de Participación
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación Pública */}
      <Navbar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isAdminMode={true} // Dejamos el botón visible para poder entrar al admin
      />

      {/* Hero solo en activas */}
      {currentSection === 'activas' && <Hero />}

      {/* Filtros */}
      <Filters
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        isAdminMode={false} // En la home ya no cambiamos modo, usamos el botón del navbar
        onAdminModeToggle={() => {}}
      />

      {/* Contenido Principal */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {currentSection === 'activas' && (
            <ActivePoolsSection
              pools={filteredPools()}
              onParticipate={handleParticipate}
              onEdit={() => {}}
              isAdminMode={false}
            />
          )}

          {currentSection === 'cerradas' && (
            <ClosedPoolsSection
              pools={filteredPools()}
              onEdit={() => {}}
              isAdminMode={false}
            />
          )}

          {currentSection === 'participaciones' && (
            <MyParticipationsSection
              pools={filteredPools()}
              onViewResults={handleParticipate}
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

/**
 * Componente Principal App:
 * Define las rutas y la estructura de navegación global.
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA (HOME) */}
        <Route path="/" element={<LandingPage />} />

        {/* RUTAS DE ADMINISTRACIÓN (PROTEGIDAS) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard Principal */}
          <Route index element={<AdminDashboard />} />
          
          {/* Gestión de Quinielas */}
          <Route path="quinielas" element={<PoolsList />} />
          <Route path="crear" element={<CreatePool />} />
          
          {/* Nuevas Funcionalidades */}
          <Route path="partidos" element={<MatchesAPI />} />
          <Route path="resultados" element={<ResultsManager />} />
          <Route path="participantes" element={<ParticipantsList />} />
          
          {/* Configuración (Placeholder) */}
          <Route path="configuracion" element={
            <div className="p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-400">🚧 Configuración en construcción</h2>
            </div>
          } />
        </Route>

        {/* CUALQUIER OTRA RUTA REDIRIGE AL HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;