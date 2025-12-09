import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Componente Modal ULTRA SIMPLE (eliminando cualquier estilo problemático)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Fondo oscuro - ESTILO DIRECTAMENTE */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }}
        onClick={onClose}
      />
      
      {/* Modal - ESTILO DIRECTAMENTE */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}>
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '28rem',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: '#6b7280',
              zIndex: 10,
              padding: '0.25rem',
              borderRadius: '9999px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: '1'
            }}
            aria-label="Cerrar modal"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
          
          {/* Contenido */}
          <div style={{ padding: '1.5rem' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Componente principal de la aplicación
const QuinielaApp = () => {
  const [currentSection, setCurrentSection] = useState('activas');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedSort, setSelectedSort] = useState('deadline');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
   */
  const handleParticipate = (poolId) => {
    console.log('Participar en quiniela:', poolId);
  };

  /**
   * Maneja la edición de una quiniela (solo admin)
   */
  const handleEdit = (poolId) => {
    console.log('Editar quiniela:', poolId);
  };

  /**
   * Maneja el cierre del modal
   */
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  /**
   * Cambia de login a registro
   */
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  /**
   * Cambia de registro a login
   */
  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  /**
   * Maneja login exitoso
   */
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    console.log('Usuario autenticado:', userData);
    handleCloseModal();
  };

  /**
   * Maneja logout
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    console.log('Usuario cerró sesión');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Barra de navegación */}
      <Navbar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isAdminMode={isAdminMode}
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
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

      {/* Modal de Login - CON ESTILOS DIRECTOS */}
      <Modal isOpen={showLoginModal} onClose={handleCloseModal}>
        <Login 
          onClose={handleCloseModal}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      </Modal>

      {/* Modal de Registro */}
      <Modal isOpen={showRegisterModal} onClose={handleCloseModal}>
        <Register 
          onClose={handleCloseModal}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </Modal>
    </div>
  );
};

// Componente App principal
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Solo una ruta principal */}
        <Route path="/*" element={<QuinielaApp />} />
      </Routes>
    </Router>
  );
};

export default App;