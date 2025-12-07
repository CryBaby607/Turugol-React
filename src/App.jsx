import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { QUINIELAS } from './data/quinielas';


const App = () => {
  const [currentSection, setCurrentSection] = useState('activas');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedSort, setSelectedSort] = useState('deadline');

  // Filtrar quinielas según los criterios
  const filteredPools = () => {
    let pools = QUINIELAS.filter(p => {
      if (currentSection === 'activas') return p.status === POOL_STATUS.OPEN;
      if (currentSection === 'cerradas') return p.status === POOL_STATUS.CLOSED;
      if (currentSection === 'participaciones') return p.id === 1 || p.id === 4;
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
    console.log('Participar en quiniela:', poolId);
    // Aquí se abrirá el modal en una versión completa
  };

  const handleEdit = (poolId) => {
    console.log('Editar quiniela:', poolId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isAdminMode={isAdminMode}
      />

      {/* Hero Section */}
      {currentSection === 'activas' && <Hero />}

      {/* Filters */}
      <Filters
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        isAdminMode={isAdminMode}
        onAdminModeToggle={() => setIsAdminMode(!isAdminMode)}
      />

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {currentSection === 'activas' && (
            <ActivePoolsSection
              pools={filteredPools()}
              onParticipate={handleParticipate}
              onEdit={handleEdit}
              isAdminMode={isAdminMode}
            />
          )}

          {currentSection === 'cerradas' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                📊 Resultados Publicados
              </h2>
              <p className="text-gray-600">Sección de resultados - Próximamente</p>
            </div>
          )}

          {currentSection === 'participaciones' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                📜 Mis Participaciones
              </h2>
              <p className="text-gray-600">Sección de mis participaciones - Próximamente</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;