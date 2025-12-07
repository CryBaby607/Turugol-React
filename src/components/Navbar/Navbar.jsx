import React, { useState } from 'react';
import { TEXTS } from '../../constants/texts';
import { SECTIONS } from '../../constants/routes';

const Navbar = ({ currentSection, onSectionChange, isAdminMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white text-purple-700 p-2 rounded-lg">
              <span className="text-2xl">{TEXTS.icons.soccer}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{TEXTS.nav.appName}</h1>
              <p className="text-sm text-purple-100">{TEXTS.nav.tagline}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`font-semibold pb-2 border-b-2 transition ${
                  currentSection === section.id ? 'border-white' : 'border-transparent'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Admin Panel Button */}
          {isAdminMode && (
            <button className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition items-center gap-2">
              <span>{TEXTS.icons.crown}</span>
              {TEXTS.nav.adminPanel}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className="block w-full text-left font-semibold py-2 hover:text-purple-200 transition"
              >
                {section.label}
              </button>
            ))}
            {isAdminMode && (
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 mt-4">
                <span>{TEXTS.icons.crown}</span>
                {TEXTS.nav.adminPanel}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;