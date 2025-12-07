import React from 'react';
import { TEXTS } from '../../constants/texts';

const MyParticipationsSection = ({ pools, onViewResults }) => {
  if (pools.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {TEXTS.icons.history} {TEXTS.sections.myParticipationsTitle}
        </h2>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {TEXTS.myParticipations.notParticipatedTitle}
          </h3>
          <p className="text-gray-500 mb-6">{TEXTS.myParticipations.notParticipatedMsg}</p>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-6 py-3 rounded-lg">
            {TEXTS.icons.target} {TEXTS.myParticipations.seeActivePoolsBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {TEXTS.icons.history} {TEXTS.sections.myParticipationsTitle}
      </h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="space-y-4">
          {pools.map((pool) => (
            <div key={pool.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{pool.title}</h4>
                  <div className="text-gray-600 text-sm">
                    {TEXTS.icons.trophy} {pool.league}
                  </div>
                </div>
                <button
                  onClick={() => onViewResults(pool.id)}
                  className={`${
                    pool.status === 'closed'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white font-semibold px-4 py-2 rounded-lg transition`}
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 text-green-800 p-3 rounded-full mr-4">
            {TEXTS.icons.chart}
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800">
              {TEXTS.myParticipations.generalPerformance}
            </h4>
            <p className="text-gray-600 text-sm">
              {TEXTS.myParticipations.basedOnRecent}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">2</div>
            <div className="text-sm text-gray-600">{TEXTS.myParticipations.totalQuinielas}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">6.5</div>
            <div className="text-sm text-gray-600">{TEXTS.myParticipations.averageHits}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">{TEXTS.myParticipations.bestResult}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">72%</div>
            <div className="text-sm text-gray-600">{TEXTS.myParticipations.hitRate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyParticipationsSection;