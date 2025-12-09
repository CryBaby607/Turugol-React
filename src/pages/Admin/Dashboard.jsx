import React from 'react';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow p-6 hover:-translate-y-1 transition transform duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        <i className={`fas ${icon} text-2xl`}></i>
      </div>
    </div>
    <div className="mt-4">
      <span className={`text-${color}-600 text-sm font-semibold`}>{trend}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  // En una app real, estos datos vendrían de useQuery llamando a /api/admin/stats
  const stats = [
    { title: 'Quinielas Activas', value: '12', icon: 'fa-trophy', color: 'blue', trend: '+2 esta semana' },
    { title: 'Participantes', value: '1,247', icon: 'fa-users', color: 'green', trend: '+45 hoy' },
    { title: 'Pronósticos', value: '5,892', icon: 'fa-chart-bar', color: 'purple', trend: '+312 hoy' },
    { title: 'Tasa Part.', value: '78%', icon: 'fa-percentage', color: 'yellow', trend: '+5% vs semana pasada' },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Tabla Reciente */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-800">Quinielas Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">Champions League - Semis</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Activa</span></td>
                <td className="px-6 py-4">324</td>
                <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline">Gestionar</td>
              </tr>
              {/* Más filas estáticas o dinámicas... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;