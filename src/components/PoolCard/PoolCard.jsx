import React from 'react';
import { TEXTS } from '../../constants/texts';
import { getTimeLeft } from '../../utils/dateUtils';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const PoolCard = ({ pool, onParticipate, onEdit, isAdminMode }) => {
  const timeLeft = getTimeLeft(pool.deadline);
  const isUrgent = pool.urgent;

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition",
        COLOR_CLASSES.borders.gray,
        pool.featured && "border-l-4"
      )}
      style={{
        borderLeftColor: pool.featured ? HEX_COLORS.warning : 'transparent'
      }}
    >
      {/* Featured Badge */}
      {pool.featured && (
        <div 
          className="text-center py-1 text-sm font-bold"
          style={{
            backgroundColor: HEX_COLORS.warning,
            color: 'white'
          }}
        >
          {TEXTS.icons.trophy} {TEXTS.cards.featured}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 
              className="text-xl font-bold mb-1"
              style={{ color: HEX_COLORS.textDark }}
            >
              {pool.title}
            </h3>
            <div style={{ color: HEX_COLORS.textLight }}>
              {TEXTS.icons.trophy} {pool.league}
            </div>
          </div>
          {isUrgent && (
            <span 
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: HEX_COLORS.error + '20',
                color: HEX_COLORS.error
              }}
            >
              {TEXTS.icons.lightning} {TEXTS.cards.urgent}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: HEX_COLORS.bgLight }}
          >
            <div 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.cards.closesIn}
            </div>
            <div
              className="text-lg font-bold"
              style={{ 
                color: isUrgent ? HEX_COLORS.error : HEX_COLORS.textDark 
              }}
            >
              {timeLeft}
            </div>
          </div>
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: HEX_COLORS.bgLight }}
          >
            <div 
              className="text-sm"
              style={{ color: HEX_COLORS.textLight }}
            >
              {TEXTS.cards.participants}
            </div>
            <div 
              className="text-lg font-bold"
              style={{ color: HEX_COLORS.textDark }}
            >
              {pool.participants}
            </div>
          </div>
        </div>

        {/* Matches List */}
        {pool.matchesList && pool.matchesList.length > 0 && (
          <div className="mb-6">
            <h4 
              className="font-semibold mb-3"
              style={{ color: HEX_COLORS.textDark }}
            >
              {TEXTS.cards.someMatches}
            </h4>
            <div className="space-y-2">
              {pool.matchesList.slice(0, 3).map((match) => (
                <div
                  key={match.id}
                  className="flex justify-between items-center text-sm p-2 rounded transition"
                  style={{ 
                    backgroundColor: HEX_COLORS.bgLight 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = HEX_COLORS.bgLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = HEX_COLORS.bgLight;
                  }}
                >
                  <div>
                    <div 
                      className="font-medium"
                      style={{ color: HEX_COLORS.textDark }}
                    >
                      {match.local} vs {match.visitor}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: HEX_COLORS.textLight }}
                    >
                      {match.league}
                    </div>
                  </div>
                  <div 
                    className="text-xs whitespace-nowrap"
                    style={{ color: HEX_COLORS.textLight }}
                  >
                    {match.date}
                  </div>
                </div>
              ))}
              {pool.matchesList.length > 3 && (
                <div 
                  className="text-center text-sm p-2"
                  style={{ color: HEX_COLORS.textLight }}
                >
                  +{pool.matches - 3} {TEXTS.cards.moreMatches}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onParticipate(pool.id)}
            className={cn(
              "flex-1 text-white font-semibold py-3 rounded-lg transition",
              "flex items-center justify-center gap-2"
            )}
            style={{
              background: isUrgent 
                ? `linear-gradient(135deg, ${HEX_COLORS.error}, ${HEX_COLORS.error}${'90'})`
                : `linear-gradient(135deg, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`,
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <span>{isUrgent ? TEXTS.icons.lightning : TEXTS.icons.ticket}</span>
            <span>{isUrgent ? TEXTS.cards.participateNow : TEXTS.cards.participate}</span>
          </button>
          {isAdminMode && (
            <button
              onClick={() => onEdit(pool.id)}
              className={cn(
                COLOR_CLASSES.components.button.secondary,
                "px-4 py-3 rounded-lg transition"
              )}
              title="Editar quiniela"
            >
              {TEXTS.icons.pencil}
            </button>
          )}
        </div>

        {/* Admin Info */}
        {isAdminMode && (
          <div 
            className="mt-4 pt-4 text-sm"
            style={{ 
              borderColor: HEX_COLORS.borderGray,
              color: HEX_COLORS.textLight 
            }}
          >
            {TEXTS.icons.shield} {TEXTS.cards.createdBy} {pool.creator}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolCard;