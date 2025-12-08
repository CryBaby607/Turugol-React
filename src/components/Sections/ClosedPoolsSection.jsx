import React from 'react';
import { TEXTS } from '../../constants/texts';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const ClosedPoolsSection = ({ pools, onEdit, isAdminMode }) => {
  if (pools.length === 0) {
    return (
      <div>
        <h2 
          className="text-3xl font-bold mb-8"
          style={{ color: HEX_COLORS.textDark }}
        >
          <span style={{ color: HEX_COLORS.primary }}>{TEXTS.icons.chart}</span>{' '}
          {TEXTS.sections.closedPoolsTitle}
        </h2>
        <div className="text-center py-12">
          <div 
            className="text-5xl mb-4"
            style={{ color: HEX_COLORS.success }}
          >
            ✓
          </div>
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: HEX_COLORS.textDark }}
          >
            {TEXTS.results.noResultsTitle}
          </h3>
          <p style={{ color: HEX_COLORS.textLight }}>
            {TEXTS.results.noResultsMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 
        className="text-3xl font-bold mb-8"
        style={{ color: HEX_COLORS.textDark }}
      >
        <span style={{ color: HEX_COLORS.primary }}>{TEXTS.icons.chart}</span>{' '}
        {TEXTS.sections.closedPoolsTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <div 
            key={pool.id} 
            className={cn(
              "bg-white rounded-xl shadow-lg overflow-hidden",
              COLOR_CLASSES.borders.gray
            )}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 
                  className="text-xl font-bold"
                  style={{ color: HEX_COLORS.textDark }}
                >
                  {pool.title}
                </h3>
                <span 
                  className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor: HEX_COLORS.info + '20',
                    color: HEX_COLORS.info
                  }}
                >
                  {TEXTS.icons.checkmark} {TEXTS.results.completed}
                </span>
              </div>

              {pool.results && (
                <div 
                  className="p-4 rounded-lg mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${HEX_COLORS.info}10, ${HEX_COLORS.primary}10)`
                  }}
                >
                  <div className="text-center mb-4">
                    <div 
                      className="text-sm"
                      style={{ color: HEX_COLORS.textLight }}
                    >
                      {TEXTS.results.winner}
                    </div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: HEX_COLORS.info }}
                    >
                      {pool.results.winner}
                    </div>
                    <div 
                      className="text-lg"
                      style={{ color: HEX_COLORS.textDark }}
                    >
                      {pool.results.winnerScore} aciertos
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div 
                        className="text-sm"
                        style={{ color: HEX_COLORS.textLight }}
                      >
                        {TEXTS.results.maxScore}
                      </div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: HEX_COLORS.textDark }}
                      >
                        {pool.results.maxScore}
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-sm"
                        style={{ color: HEX_COLORS.textLight }}
                      >
                        {TEXTS.results.yourResult}
                      </div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: HEX_COLORS.success }}
                      >
                        {pool.results.userScore}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                className={cn(
                  "w-full text-white font-semibold py-3 rounded-lg transition",
                  COLOR_CLASSES.components.button.primary
                )}
                style={{
                  background: `linear-gradient(135deg, ${HEX_COLORS.info}, ${HEX_COLORS.primary})`,
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <span style={{ marginRight: '8px' }}>{TEXTS.icons.chart}</span>
                {TEXTS.results.viewFullResults}
              </button>

              {isAdminMode && (
                <button
                  onClick={() => onEdit(pool.id)}
                  className={cn(
                    "w-full mt-3 font-semibold py-2 rounded-lg transition",
                    COLOR_CLASSES.components.button.secondary
                  )}
                >
                  {TEXTS.icons.pencil} Editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosedPoolsSection;