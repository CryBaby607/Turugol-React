import React from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { QUINIELAS } from '../../data/quiniela'; // Reutilizamos tus datos

const PoolsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Quinielas</h2>
        <Link 
          to="/admin/crear" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FaPlus /> Nueva Quiniela
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part.</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {QUINIELAS.map((pool) => (
              <tr key={pool.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{pool.title}</td>
                <td className="px-6 py-4 text-gray-600">{pool.league}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    pool.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pool.status === 'open' ? 'Activa' : 'Cerrada'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{pool.participants}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                  <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolsList;