import React from 'react';
import { TEXTS } from '../../constants/texts';

const ClosedPoolsSection = ({ pools, onEdit, isAdminMode }) => {
  if (pools.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {TEXTS.icons.chart} {TEXTS.sections.closedPoolsTitle}
        </h2>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {TEXTS.results.noResultsTitle}
          </h3>
          <p className="text-gray-500">{TEXTS.results.noResultsMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {TEXTS.icons.chart} {TEXTS.sections.closedPoolsTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <div key={pool.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{pool.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {TEXTS.icons.checkmark} {TEXTS.results.completed}
                </span>
              </div>

              {pool.results && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600">{TEXTS.results.winner}</div>
                    <div className="text-2xl font-bold text-blue-700">{pool.results.winner}</div>
                    <div className="text-lg text-gray-700">{pool.results.winnerScore} aciertos</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">{TEXTS.results.maxScore}</div>
                      <div className="text-lg font-bold">{pool.results.maxScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">{TEXTS.results.yourResult}</div>
                      <div className="text-lg font-bold text-green-600">{pool.results.userScore}</div>
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition">
                {TEXTS.icons.chart} {TEXTS.results.viewFullResults}
              </button>

              {isAdminMode && (
                <button
                  onClick={() => onEdit(pool.id)}
                  className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
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