import React, { useState } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const CreatePool = () => {
  const [matches, setMatches] = useState([{ id: 1, local: '', visitor: '' }]);

  const addMatch = () => {
    if (matches.length < 9) {
      setMatches([...matches, { id: Date.now(), local: '', visitor: '' }]);
    }
  };

  const removeMatch = (id) => {
    setMatches(matches.filter(m => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Funcionalidad de guardar pendiente de backend');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Quiniela</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Ej: Jornada 12" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Liga</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option>Liga MX</option>
                <option>Premier League</option>
                <option>Champions League</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
              <input type="datetime-local" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Partidos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Partidos ({matches.length}/9)</h3>
              <button 
                type="button" 
                onClick={addMatch}
                disabled={matches.length >= 9}
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <FaPlus /> Agregar Partido
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((match, index) => (
                <div key={match.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-400 w-6">#{index + 1}</span>
                  <input type="text" placeholder="Equipo Local" className="flex-1 border border-gray-300 rounded px-3 py-1" />
                  <span className="text-gray-400 font-bold">VS</span>
                  <input type="text" placeholder="Equipo Visitante" className="flex-1 border border-gray-300 rounded px-3 py-1" />
                  <button type="button" onClick={() => removeMatch(match.id)} className="text-red-500 hover:text-red-700 p-2">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <FaSave /> Guardar Quiniela
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePool;