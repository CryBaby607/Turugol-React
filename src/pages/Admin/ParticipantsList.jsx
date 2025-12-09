import React from 'react';
import { FaUserCircle, FaTrophy } from 'react-icons/fa';

const ParticipantsList = () => {
  // Datos mockeados
  const users = [
    { id: 1, name: 'FutbolMaster22', email: 'master@test.com', wins: 3, participations: 15 },
    { id: 2, name: 'ProdeKing', email: 'king@test.com', wins: 1, participations: 12 },
    { id: 3, name: 'AnalistaFutbol', email: 'analista@test.com', wins: 0, participations: 4 },
  ];

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Directorio de Participantes</h2>
        <div className="text-sm text-gray-500">Total: {users.length} usuarios</div>
      </div>
      
      <table className="w-full">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-3 text-left">Usuario</th>
            <th className="px-6 py-3 text-center">Quinielas Jugadas</th>
            <th className="px-6 py-3 text-center">Victorias</th>
            <th className="px-6 py-3 text-right">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <FaUserCircle className="text-3xl text-gray-300 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center font-medium">{user.participations}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                  <FaTrophy /> {user.wins}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Activo</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsList;