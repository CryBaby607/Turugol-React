import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const UserDashboardPage = () => {
  return (
    <DashboardLayout isAdmin={false}>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Resumen de Usuario</h2>
        <p className="text-gray-600">Bienvenido de nuevo. Revisa el estado de tus pronósticos y únete a nuevas quinielas.</p>
        
        {/* Aquí puedes poner métricas y widgets del usuario */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-600">Quinielas Activas</p>
                <p className="text-3xl font-bold text-emerald-900">3</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-600">Puntos Totales</p>
                <p className="text-3xl font-bold text-yellow-900">1,450</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">Récord</p>
                <p className="text-3xl font-bold text-blue-900">Top 10%</p>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;