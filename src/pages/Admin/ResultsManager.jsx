import React, { useState } from 'react';
import { QUINIELAS } from '../../data/quiniela'; // Usamos tus datos

const ResultsManager = () => {
  const closedPools = QUINIELAS.filter(p => p.status === 'closed' || p.status === 'open');
  const [selectedPool, setSelectedPool] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Quinielas para calificar */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-700">Seleccionar Quiniela</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {closedPools.map(pool => (
            <button
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className={`w-full text-left p-4 hover:bg-purple-50 transition ${selectedPool?.id === pool.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''}`}
            >
              <div className="font-medium text-gray-900">{pool.title}</div>
              <div className="text-xs text-gray-500 mt-1">{pool.league} • {pool.participants} participantes</div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel de Ingreso de Resultados */}
      <div className="lg:col-span-2">
        {selectedPool ? (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Resultados: {selectedPool.title}</h2>
            <p className="text-gray-600 text-sm mb-6">Selecciona el resultado final de los 9 partidos.</p>
            
            <div className="space-y-4">
              {/* Si tu objeto QUINIELAS tiene matchesList lo usamos, si no, mockeamos */}
              {(selectedPool.matchesList || Array(9).fill({local:'Local', visitor:'Visitante'})).slice(0,9).map((match, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="w-1/3 text-right font-medium pr-4">{match.local || 'Local'}</div>
                  
                  <div className="flex gap-2">
                    {['1', 'X', '2'].map(res => (
                      <button key={res} className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition font-bold text-gray-600 focus:ring-2 focus:ring-purple-300 focus:bg-purple-700 focus:text-white">
                        {res}
                      </button>
                    ))}
                  </div>
                  
                  <div className="w-1/3 text-left font-medium pl-4">{match.visitor || 'Visitante'}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 shadow-lg transform hover:-translate-y-0.5 transition">
                Publicar Resultados Oficiales
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            <p>Selecciona una quiniela de la lista para ingresar los resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsManager;