import React from 'react';
import { TEXTS } from '../../constants/texts';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const Hero = () => {
  const stats = [
    { num: '9', label: TEXTS.hero.matchesPerPool },
    { num: '15+', label: TEXTS.hero.availableLeagues },
    { num: '100%', label: TEXTS.hero.free },
  ];

  return (
    <section 
      className="text-white py-12 md:py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`
      }}
    >
      {/* Elemento decorativo sutil */}
      <div 
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
        style={{ backgroundColor: HEX_COLORS.primary }}
      ></div>
      <div 
        className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
        style={{ backgroundColor: HEX_COLORS.secondary }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {TEXTS.hero.title}
        </h1>
        <p 
          className="text-xl md:text-2xl mb-8"
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          {TEXTS.hero.subtitle}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="rounded-xl p-6 min-w-[120px] transition-transform duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="text-4xl font-bold mb-2">{stat.num}</div>
              <div 
                className="text-sm font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button - efecto sutil */}
        <div className="inline-block">
          <button 
            className={cn(
              "font-bold px-10 py-3 rounded-xl text-lg",
              "transition-all duration-200",
              "flex items-center justify-center gap-3",
              "relative"
            )}
            style={{
              background: 'white',
              color: HEX_COLORS.primary,
              border: 'none',
              boxShadow: `0 6px 20px ${HEX_COLORS.primary}30`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 25px ${HEX_COLORS.primary}50`;
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 6px 20px ${HEX_COLORS.primary}30`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span 
              className="text-xl"
              style={{ color: HEX_COLORS.primary }}
            >
              {TEXTS.icons.play}
            </span>
            <span className="font-semibold">
              {TEXTS.hero.ctaButton}
            </span>
          </button>
          
          {/* Glow sutil detrás del botón */}
          <div 
            className="absolute -inset-2 rounded-xl blur-md opacity-30 -z-10"
            style={{
              background: `linear-gradient(135deg, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;