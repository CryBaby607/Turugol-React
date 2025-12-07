import React from 'react';
import PoolsGrid from '../PoolsGrid/PoolsGrid';
import { TEXTS } from '../../constants/texts';

const ActivePoolsSection = ({ pools, onParticipate, onEdit, isAdminMode }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {TEXTS.icons.target} {TEXTS.sections.activePoolsTitle}
      </h2>
      <PoolsGrid
        pools={pools}
        onParticipate={onParticipate}
        onEdit={onEdit}
        isAdminMode={isAdminMode}
        emptyMessage={{
          icon: '📅',
          title: TEXTS.cards.noActivePoolsTitle,
          message: TEXTS.cards.noActivePoolsMsg,
        }}
      />
    </div>
  );
};

export default ActivePoolsSection;