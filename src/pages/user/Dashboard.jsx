import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

// Componente reutilizable para las tarjetas de estadísticas
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  const textColors = {
    emerald: 'text-emerald-900',
    yellow: 'text-yellow-900',
    blue: 'text-blue-900',
    purple: 'text-purple-900',
  };

  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-transform hover:scale-105 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${textColors[color]}`}>{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-white bg-opacity-40`}>
            <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      {trend && (
        <p className="text-xs mt-3 font-medium flex items-center">
          <span className="bg-white bg-opacity-50 px-2 py-0.5 rounded text-current">
            {trend}
          </span>
        </p>
      )}
    </div>
  );
};

const UserDashboardPage = () => {
  // Datos simulados (luego vendrán de tu base de datos)
  const userData = {
    name: "Campeón",
    activeQuinielas: 3,
    points: 1450,
    ranking: "Top 10%",
    nextClose: "Jornada 14 - Cierra en 3h"
  };

  return (
    <DashboardLayout isAdmin={false}>
      {/* 1. Header de Bienvenida con Gradiente */}
      <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">¡Hola, {userData.name}! 👋</h1>
            <p className="text-emerald-100 opacity-90 text-lg">
                Tienes <span className="font-bold text-white">{userData.activeQuinielas} quinielas</span> en juego esta semana.
            </p>
            <div className="mt-6 flex gap-3">
                <Link to="/dashboard/user/avaliblequinelas" className="bg-white text-emerald-700 px-5 py-2 rounded-lg font-bold shadow hover:bg-emerald-50 transition-colors">
                    <i className="fas fa-plus-circle mr-2"></i>Nueva Quiniela
                </Link>
                <Link to="/dashboard/user/history" className="bg-emerald-700 bg-opacity-40 text-white border border-emerald-400 px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Ver Historial
                </Link>
            </div>
        </div>
        {/* Decoración de fondo */}
        <i className="fas fa-futbol absolute -right-4 -bottom-8 text-9xl opacity-10 rotate-12"></i>
      </div>

      {/* 2. Grid de Métricas Mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Quinielas Activas" 
            value={userData.activeQuinielas} 
            color="emerald" 
            icon="fas fa-ticket-alt"
            trend="2 pendientes de resultado"
        />
        <StatCard 
            title="Puntos Totales" 
            value={userData.points} 
            color="yellow" 
            icon="fas fa-star"
            trend="+120 esta semana"
        />
        <StatCard 
            title="Ranking Global" 
            value={userData.ranking} 
            color="blue" 
            icon="fas fa-trophy"
            trend="Subiste 5 puestos 🚀"
        />
        {/* Nueva tarjeta de urgencia */}
        <StatCard 
            title="Próximo Cierre" 
            value="18:00 H" 
            color="purple" 
            icon="fas fa-clock"
            trend={userData.nextClose}
        />
      </div>

      {/* 3. Sección Dividida: Actividad Reciente + Novedades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Actividad Reciente */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Actividad Reciente</h3>
                <Link to="/dashboard/user/history" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Ver todo</Link>
            </div>
            
            <div className="space-y-4">
                {/* Item de lista simulado */}
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <i className="fas fa-futbol"></i>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Quiniela Jornada {10 + item}</p>
                                <p className="text-xs text-gray-500">Finalizado • 12 Aciertos</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            +150 Pts
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Columna Derecha: Anuncios / Promo */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-md flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold mb-2">🏆 Torneo Mensual</h3>
                <p className="text-indigo-100 text-sm mb-4">
                    ¡No olvides unirte a la Quiniela Especial de la Champions! Premios dobles esta semana.
                </p>
            </div>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                Ver Detalles
            </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;