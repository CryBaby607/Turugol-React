import React from 'react';
import { TEXTS } from '../../constants/texts';
import { LEAGUES, SORT_OPTIONS } from '../../constants/routes';

const Filters = ({
  selectedLeague,
  onLeagueChange,
  selectedSort,
  onSortChange,
  isAdminMode,
  onAdminModeToggle,
}) => {
  return (
    <section className="bg-white py-8 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔍 {TEXTS.filters.filterByLeague}
              </label>
              <select
                value={selectedLeague}
                onChange={(e) => onLeagueChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LEAGUES.map((league) => (
                  <option key={league.value} value={league.value}>
                    {league.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔍 {TEXTS.filters.sortBy}
              </label>
              <select
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={onAdminModeToggle}
            className="text-sm text-gray-600 hover:text-purple-700 font-semibold transition"
          >
            🛡️ {isAdminMode ? TEXTS.nav.adminMode : TEXTS.nav.userMode}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Filters;