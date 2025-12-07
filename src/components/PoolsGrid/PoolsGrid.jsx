import React from 'react';
import PoolCard from '../PoolCard/PoolCard';

const PoolsGrid = ({ pools, onParticipate, onEdit, isAdminMode, emptyMessage }) => {
  // Si no hay quinielas, mostrar mensaje vacío
  if (pools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">{emptyMessage?.icon || '📅'}</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {emptyMessage?.title || 'No hay quinielas'}
        </h3>
        <p className="text-gray-500">{emptyMessage?.message || 'Intenta más tarde'}</p>
      </div>
    );
  }

  // Mostrar grid de tarjetas
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          onParticipate={onParticipate}
          onEdit={onEdit}
          isAdminMode={isAdminMode}
        />
      ))}
    </div>
  );
};

export default PoolsGrid;