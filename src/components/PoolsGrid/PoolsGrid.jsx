import React from 'react';
import PoolCard from '../PoolCard/PoolCard';
import { HEX_COLORS } from '../../constants/colors';

const PoolsGrid = ({ pools, onParticipate, onEdit, isAdminMode, emptyMessage }) => {
  // Si no hay quinielas, mostrar mensaje vacío
  if (pools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">{emptyMessage?.icon || '📅'}</div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: HEX_COLORS.textDark }}
        >
          {emptyMessage?.title || 'No hay quinielas'}
        </h3>
        <p style={{ color: HEX_COLORS.textLight }}>
          {emptyMessage?.message || 'Intenta más tarde'}
        </p>
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