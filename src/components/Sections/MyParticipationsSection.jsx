import React from 'react';
import { TEXTS } from '../../constants/texts';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const MyParticipationsSection = ({ pools, onViewResults }) => {
  if (pools.length === 0) {
    return (
      <div>
        <h2 
          className="text-3xl font-bold mb-8"
          style={{ color: HEX_COLORS.textDark }}
        >
          <span style={{ color: HEX_COLORS.primary }}>{TEXTS.icons.history}</span>{' '}
          {TEXTS.sections.myParticipationsTitle}
        </h2>
        <div className="text-center py-12">
          <div 
            className="text-5xl mb-4"
            style={{ color: HEX_COLORS.primary }}
          >
            📋
          </div>
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: HEX_COLORS.textDark }}
          >
            {TEXTS.myParticipations.notParticipatedTitle}
          </h3>
          <p 
            className="mb-6"
            style={{ color: HEX_COLORS.textLight }}
          >
            {TEXTS.myParticipations.notParticipatedMsg}
          </p>
          <button 
            className={cn(
              "text-white font-semibold px-6 py-3 rounded-lg",
              COLOR_CLASSES.components.button.primary
            )}
            style={{
              background: `linear-gradient(135deg, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`,
              border: 'none'
            }}
          >
            <span style={{ marginRight: '8px' }}>{TEXTS.icons.target}</span>
            {TEXTS.myParticipations.seeActivePoolsBtn}
          </button>
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
        <span style={{ color: HEX_COLORS.primary }}>{TEXTS.icons.history}</span>{' '}
        {TEXTS.sections.myParticipationsTitle}
      </h2>
      <div className={cn(
        COLOR_CLASSES.components.card.elevated,
        "p-6 mb-6"
      )}>
        <div className="space-y-4">
          {pools.map((pool) => (
            <div 
              key={pool.id} 
              className={cn(
                "rounded-lg p-4 hover:bg-gray-50 transition",
                COLOR_CLASSES.borders.gray
              )}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 
                    className="font-bold text-lg"
                    style={{ color: HEX_COLORS.textDark }}
                  >
                    {pool.title}
                  </h4>
                  <div 
                    className="text-sm"
                    style={{ color: HEX_COLORS.textLight }}
                  >
                    {TEXTS.icons.trophy} {pool.league}
                  </div>
                </div>
                <button
                  onClick={() => onViewResults(pool.id)}
                  className={cn(
                    "text-white font-semibold px-4 py-2 rounded-lg transition"
                  )}
                  style={{
                    backgroundColor: pool.status === 'closed' ? HEX_COLORS.info : HEX_COLORS.success,
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  {pool.status === 'closed'
                    ? `${TEXTS.icons.chart} ${TEXTS.myParticipations.viewResults}`
                    : `${TEXTS.icons.play} ${TEXTS.myParticipations.viewMyPrediction}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Card */}
      <div 
        className="rounded-xl p-6"
        style={{
          background: `linear-gradient(135deg, ${HEX_COLORS.success}10, ${HEX_COLORS.secondary}10)`,
          border: `1px solid ${HEX_COLORS.success}30`
        }}
      >
        <div className="flex items-center mb-4">
          <div 
            className="p-3 rounded-full mr-4"
            style={{
              backgroundColor: HEX_COLORS.success + '20',
              color: HEX_COLORS.success
            }}
          >
            {TEXTS.icons.chart}
          </div>
          <div>
            <h4 
              className="font-bold text-lg"
              style={{ color: HEX_COLORS.textDark }}
            >
              {TEXTS.myParticipations.generalPerformance}
            </h4>
            <p 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.myParticipations.basedOnRecent}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: HEX_COLORS.textDark }}
            >
              2
            </div>
            <div 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.myParticipations.totalQuinielas}
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: HEX_COLORS.success }}
            >
              6.5
            </div>
            <div 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.myParticipations.averageHits}
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: HEX_COLORS.info }}
            >
              8
            </div>
            <div 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.myParticipations.bestResult}
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: HEX_COLORS.primary }}
            >
              72%
            </div>
            <div 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.myParticipations.hitRate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyParticipationsSection;