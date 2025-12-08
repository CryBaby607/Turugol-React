import React, { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { SECTIONS } from '../../constants/routes';
import { HEX_COLORS, cn } from '../../constants/colors';

const Navbar = ({ currentSection, onSectionChange, isAdminMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll (opcional)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  // Estilo en línea usando HEX_COLORS para máxima flexibilidad
  const navbarStyle = {
    background: `linear-gradient(to right, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`,
  };

  const logoStyle = {
    color: HEX_COLORS.primary,
  };

  const activeSectionStyle = {
    backgroundColor: HEX_COLORS.bgLight + '20', // 20 = 12% opacity en hex
  };

  return (
    <nav 
      style={navbarStyle}
      className={cn(
        "text-white shadow-lg sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "py-3" : "py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo con enlace a home */}
          <button 
            onClick={() => handleSectionChange('home')}
            className="flex items-center space-x-3 group"
          >
            <div 
              className="bg-white p-2 rounded-lg group-hover:scale-105 transition-transform duration-200"
              style={logoStyle}
            >
              <span className="text-2xl">{TEXTS.icons.soccer}</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight">{TEXTS.nav.appName}</h1>
              <p className="text-sm text-purple-100 opacity-90">
                {TEXTS.nav.tagline}
              </p>
            </div>
          </button>

          {/* Desktop Navigation con indicador activo */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {SECTIONS.map((section) => (
              <div key={section.id} className="relative">
                <button
                  onClick={() => handleSectionChange(section.id)}
                  className={cn(
                    "font-semibold px-4 py-2 rounded-lg transition-all duration-200",
                    currentSection === section.id
                      ? "text-white" 
                      : "text-purple-100 hover:text-white hover:bg-white/10"
                  )}
                  style={currentSection === section.id ? activeSectionStyle : {}}
                >
                  {section.label}
                </button>
                {currentSection === section.id && (
                  <div 
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: HEX_COLORS.bgWhite }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Side Actions */}
          <div className="flex items-center space-x-4">
            {isAdminMode && (
              <button 
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: HEX_COLORS.warning,
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = HEX_COLORS.warning + 'CC'; // Oscurecer
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = HEX_COLORS.warning;
                }}
              >
                <span className="text-lg">{TEXTS.icons.crown}</span>
                <span className="hidden lg:inline">{TEXTS.nav.adminPanel}</span>
                <span className="lg:hidden">Admin</span>
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="text-2xl">
                {mobileMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu con animación */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-2 pt-4 border-t border-white/20">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={cn(
                  "flex items-center justify-between w-full text-left font-semibold py-3 px-4 rounded-lg transition-colors duration-200",
                  currentSection === section.id
                    ? "text-white"
                    : "text-purple-100 hover:bg-white/10"
                )}
                style={currentSection === section.id ? activeSectionStyle : {}}
              >
                <span>{section.label}</span>
                {currentSection === section.id && (
                  <span className="text-lg">→</span>
                )}
              </button>
            ))}
            
            {isAdminMode && (
              <div className="pt-4 border-t border-white/20">
                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: HEX_COLORS.warning,
                    color: '#ffffff',
                  }}
                >
                  <span className="text-lg">{TEXTS.icons.crown}</span>
                  {TEXTS.nav.adminPanel}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;