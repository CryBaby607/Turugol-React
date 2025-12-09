import React, { useState } from 'react';
import { FaCloudDownloadAlt, FaCheck, FaFutbol } from 'react-icons/fa';
import { LEAGUES } from '../../constants/routes';

const MatchesAPI = () => {
  const [loading, setLoading] = useState(false);
  const [importedMatches, setImportedMatches] = useState([]);

  // Simula la llamada a una API real
  const handleImport = (leagueId) => {
    if (!leagueId) return;
    setLoading(true);
    
    // Simulamos un delay de red
    setTimeout(() => {
      const mockMatches = [
        { id: 101, local: 'Manchester City', visitor: 'Arsenal', date: '2024-04-01 20:00' },
        { id: 102, local: 'Liverpool', visitor: 'Brighton', date: '2024-04-01 15:00' },
        { id: 103, local: 'Aston Villa', visitor: 'Wolves', date: '2024-04-02 18:30' },
      ];
      setImportedMatches(mockMatches);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Importar Partidos desde API</h2>
        <p className="text-gray-600 mb-6">Conecta con proveedores externos para cargar la jornada automáticamente.</p>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Liga</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              onChange={(e) => handleImport(e.target.value)}
            >
              <option value="">Selecciona una competición...</option>
              {LEAGUES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <button 
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Cargando...' : <><FaCloudDownloadAlt /> Importar Jornada</>}
          </button>
        </div>
      </div>

      {/* Resultados de la importación */}
      {importedMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden animate-fade-in">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Partidos Encontrados ({importedMatches.length})</h3>
            <button className="text-sm text-blue-600 hover:underline">Guardar en Base de Datos</button>
          </div>
          <div className="divide-y divide-gray-100">
            {importedMatches.map(match => (
              <div key={match.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="text-gray-400"><FaFutbol /></div>
                  <div className="font-medium">
                    {match.local} <span className="text-gray-400 mx-2">vs</span> {match.visitor}
                  </div>
                </div>
                <div className="text-sm text-gray-500">{match.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesAPI;