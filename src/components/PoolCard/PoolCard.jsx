import React from 'react';
import { TEXTS } from '../../constants/texts';
import { getTimeLeft } from '../../utils/dateUtils';

const PoolCard = ({ pool, onParticipate, onEdit, isAdminMode }) => {
  const timeLeft = getTimeLeft(pool.deadline);
  const isUrgent = pool.urgent;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition border border-gray-200 ${
        pool.featured ? 'border-l-4 border-l-amber-500' : ''
      }`}
    >
      {/* Featured Badge */}
      {pool.featured && (
        <div className="bg-amber-500 text-white text-center py-1 text-sm font-bold">
          {TEXTS.icons.trophy} {TEXTS.cards.featured}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{pool.title}</h3>
            <div className="text-gray-600">
              {TEXTS.icons.trophy} {pool.league}
            </div>
          </div>
          {isUrgent && (
            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              {TEXTS.icons.lightning} {TEXTS.cards.urgent}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">{TEXTS.cards.closesIn}</div>
            <div
              className={`text-lg font-bold ${
                isUrgent ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              {timeLeft}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">{TEXTS.cards.participants}</div>
            <div className="text-lg font-bold text-gray-800">{pool.participants}</div>
          </div>
        </div>

        {/* Matches List */}
        {pool.matchesList && pool.matchesList.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">
              {TEXTS.cards.someMatches}
            </h4>
            <div className="space-y-2">
              {pool.matchesList.slice(0, 3).map((match) => (
                <div
                  key={match.id}
                  className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
                >
                  <div>
                    <div className="font-medium">
                      {match.local} vs {match.visitor}
                    </div>
                    <div className="text-gray-500 text-xs">{match.league}</div>
                  </div>
                  <div className="text-gray-500 text-xs whitespace-nowrap">{match.date}</div>
                </div>
              ))}
              {pool.matchesList.length > 3 && (
                <div className="text-center text-sm text-gray-500 p-2">
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
            className={`flex-1 ${
              isUrgent
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            } text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2`}
          >
            <span>{isUrgent ? TEXTS.icons.lightning : TEXTS.icons.ticket}</span>
            <span>{isUrgent ? TEXTS.cards.participateNow : TEXTS.cards.participate}</span>
          </button>
          {isAdminMode && (
            <button
              onClick={() => onEdit(pool.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-3 rounded-lg transition"
              title="Editar quiniela"
            >
              {TEXTS.icons.pencil}
            </button>
          )}
        </div>

        {/* Admin Info */}
        {isAdminMode && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
            {TEXTS.icons.shield} {TEXTS.cards.createdBy} {pool.creator}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolCard;