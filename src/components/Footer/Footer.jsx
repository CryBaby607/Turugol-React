import React from 'react';
import { TEXTS } from '../../constants/texts';
import { FOOTER_LEAGUES } from '../../constants/routes';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Producto',
      items: ['Características', 'Seguridad', 'Actualizaciones']
    },
    {
      title: 'Comunidad',
      items: ['Blog', 'Foro', 'Contacto']
    },
    {
      title: 'Legal',
      items: ['Privacidad', 'Términos', 'Cookies']
    },
    {
      title: 'Social',
      items: ['Twitter', 'Facebook', 'Instagram'],
      icons: ['🐦', '📘', '📷']
    }
  ];

  return (
    <footer 
      className="py-12 mt-12"
      style={{
        backgroundColor: HEX_COLORS.textDark,
        color: 'white'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <span 
                className="text-2xl mr-3"
                style={{ color: HEX_COLORS.primary }}
              >
                {TEXTS.icons.soccer}
              </span>
              <h3 className="text-xl font-bold">
                {TEXTS.footer.appName}
              </h3>
            </div>
            <p style={{ color: HEX_COLORS.textMuted }}>
              {TEXTS.footer.description}
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4 flex items-center"
            >
              <span 
                className="mr-2"
                style={{ color: HEX_COLORS.primary }}
              >
                {TEXTS.icons.clipboard}
              </span>
              {TEXTS.footer.howItWorks}
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: HEX_COLORS.textMuted }}>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: HEX_COLORS.success }}>
                  {TEXTS.icons.checkmark}
                </span>
                {TEXTS.footer.step1}
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: HEX_COLORS.success }}>
                  {TEXTS.icons.checkmark}
                </span>
                {TEXTS.footer.step2}
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: HEX_COLORS.success }}>
                  {TEXTS.icons.checkmark}
                </span>
                {TEXTS.footer.step3}
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: HEX_COLORS.success }}>
                  {TEXTS.icons.checkmark}
                </span>
                {TEXTS.footer.step4}
              </li>
            </ul>
          </div>

          {/* Available Leagues */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4 flex items-center"
            >
              <span 
                className="mr-2"
                style={{ color: HEX_COLORS.primary }}
              >
                {TEXTS.icons.trophy}
              </span>
              {TEXTS.footer.availableLeagues}
            </h4>
            <div className="flex flex-wrap gap-2">
              {FOOTER_LEAGUES.map((league, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs transition-colors cursor-pointer"
                  style={{
                    backgroundColor: HEX_COLORS.primary + '20',
                    color: HEX_COLORS.textLight
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = HEX_COLORS.primary + '40';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = HEX_COLORS.primary + '20';
                    e.currentTarget.style.color = HEX_COLORS.textLight;
                  }}
                >
                  {league}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div 
          className="pt-8 mb-8"
          style={{ borderTop: `1px solid ${HEX_COLORS.borderGray}40` }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h5 
                  className="text-sm font-semibold mb-3"
                  style={{ color: HEX_COLORS.textLight }}
                >
                  {section.title}
                </h5>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-xs transition-colors cursor-pointer flex items-center"
                      style={{ color: HEX_COLORS.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = HEX_COLORS.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = HEX_COLORS.textMuted;
                      }}
                    >
                      {section.icons && (
                        <span className="mr-2">{section.icons[itemIndex]}</span>
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="pt-4 text-center"
          style={{ 
            borderTop: `1px solid ${HEX_COLORS.borderGray}40`,
            color: HEX_COLORS.textMuted 
          }}
        >
          <p className="text-sm">{TEXTS.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;