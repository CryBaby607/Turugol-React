import React from 'react';
import { TEXTS } from '../../constants/texts';

const Hero = () => {
  const stats = [
    { num: '9', label: TEXTS.hero.matchesPerPool },
    { num: '15+', label: TEXTS.hero.availableLeagues },
    { num: '100%', label: TEXTS.hero.free },
  ];

  return (
    <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {TEXTS.hero.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          {TEXTS.hero.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold">{stat.num}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <button className="bg-white text-purple-700 font-bold px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 mx-auto">
          <span>{TEXTS.icons.play}</span>
          {TEXTS.hero.ctaButton}
        </button>
      </div>
    </section>
  );
};

export default Hero;