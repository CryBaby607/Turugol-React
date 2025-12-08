import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Componentes
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Filters from './components/Filters/Filters';
import ActivePoolsSection from './components/Sections/ActivePoolsSection';
import ClosedPoolsSection from './components/Sections/ClosedPoolsSection';
import MyParticipationsSection from './components/Sections/MyParticipationsSection';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/login'; 
import Register from './pages/Login/Register'; 

// Datos
import { QUINIELAS } from './data/quiniela';

// Constantes
import { POOL_STATUS } from './constants/routes';

// Componente principal de la aplicación con navegación
const QuinielaApp = ({ navigate }) => {
  const [currentSection, setCurrentSection] = useState('activas');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedSort, setSelectedSort] = useState('deadline');

  /**
   * Maneja el clic en el botón de login
   */
  const handleLoginClick = () => {
    navigate('/login');
  };

  /**
   * Filtra las quinielas según los criterios:
   * - Sección actual (activas, cerradas, participaciones)
   * - Liga seleccionada
   * - Opción de ordenamiento
   */
  const filteredPools = () => {
    let pools = QUINIELAS.filter(p => {
      if (currentSection === 'activas') return p.status === POOL_STATUS.OPEN;
      if (currentSection === 'cerradas') return p.status === POOL_STATUS.CLOSED;
      if (currentSection === 'participaciones') return p.id === 1 || p.id === 4;
      return false;
    });

    // Filtrar por liga si está seleccionada
    if (selectedLeague !== 'all') {
      pools = pools.filter(p => p.leagueCode === selectedLeague);
    }

    // Ordenar según opción seleccionada
    pools.sort((a, b) => {
      if (selectedSort === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (selectedSort === 'newest') {
        return b.id - a.id;
      }
      if (selectedSort === 'participants') {
        return b.participants - a.participants;
      }
      return 0;
    });

    return pools;
  };

  /**
   * Maneja la participación en una quiniela
   * En el futuro abrirá un modal
   */
  const handleParticipate = (poolId) => {
    console.log('Participar en quiniela:', poolId);
    // TODO: Abrir modal de participación
  };

  /**
   * Maneja la edición de una quiniela (solo admin)
   */
  const handleEdit = (poolId) => {
    console.log('Editar quiniela:', poolId);
    // TODO: Abrir modal de edición
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación con botón de login */}
      <Navbar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isAdminMode={isAdminMode}
        onLoginClick={handleLoginClick}
      />

      {/* Sección Hero - Solo visible en sección de activas */}
      {currentSection === 'activas' && <Hero />}

      {/* Panel de filtros */}
      <Filters
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        isAdminMode={isAdminMode}
        onAdminModeToggle={() => setIsAdminMode(!isAdminMode)}
      />

      {/* Contenido principal */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Sección Quinielas Activas */}
          {currentSection === 'activas' && (
            <ActivePoolsSection
              pools={filteredPools()}
              onParticipate={handleParticipate}
              onEdit={handleEdit}
              isAdminMode={isAdminMode}
            />
          )}

          {/* Sección Resultados Cerrados */}
          {currentSection === 'cerradas' && (
            <ClosedPoolsSection
              pools={filteredPools()}
              onEdit={handleEdit}
              isAdminMode={isAdminMode}
            />
          )}

          {/* Sección Mis Participaciones */}
          {currentSection === 'participaciones' && (
            <MyParticipationsSection
              pools={filteredPools()}
              onViewResults={handleParticipate}
            />
          )}
        </div>
      </section>

      {/* Pie de página */}
      <Footer />
    </div>
  );
};

// Componente wrapper para usar useNavigate
const QuinielaAppWithRouter = () => {
  const navigate = useNavigate();
  return <QuinielaApp navigate={navigate} />;
};

// Componente App principal con rutas
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta principal */}
        <Route path="/*" element={<QuinielaAppWithRouter />} />
      </Routes>
    </Router>
  );
};

export default App;