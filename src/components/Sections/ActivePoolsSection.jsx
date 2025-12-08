import React from 'react';
import PoolsGrid from '../PoolsGrid/PoolsGrid';
import { TEXTS } from '../../constants/texts';
import { HEX_COLORS } from '../../constants/colors';

const ActivePoolsSection = ({ pools, onParticipate, onEdit, isAdminMode }) => {
  return (
    <div>
      <h2 
        className="text-3xl font-bold mb-8"
        style={{ color: HEX_COLORS.textDark }}
      >
        <span style={{ color: HEX_COLORS.primary }}>{TEXTS.icons.target}</span>{' '}
        {TEXTS.sections.activePoolsTitle}
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