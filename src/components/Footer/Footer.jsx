import React from 'react';
import { TEXTS } from '../../constants/texts';
import { FOOTER_LEAGUES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{TEXTS.icons.soccer}</span>
              <h3 className="text-xl font-bold">{TEXTS.footer.appName}</h3>
            </div>
            <p className="text-gray-400">{TEXTS.footer.description}</p>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {TEXTS.icons.clipboard} {TEXTS.footer.howItWorks}
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="mr-2">{TEXTS.icons.checkmark}</span>
                <span>{TEXTS.footer.step1}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">{TEXTS.icons.checkmark}</span>
                <span>{TEXTS.footer.step2}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">{TEXTS.icons.checkmark}</span>
                <span>{TEXTS.footer.step3}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">{TEXTS.icons.checkmark}</span>
                <span>{TEXTS.footer.step4}</span>
              </li>
            </ul>
          </div>

          {/* Available Leagues */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {TEXTS.icons.trophy} {TEXTS.footer.availableLeagues}
            </h4>
            <div className="flex flex-wrap gap-2">
              {FOOTER_LEAGUES.map((league, index) => (
                <span
                  key={index}
                  className="bg-gray-800 px-3 py-1 rounded-full text-xs hover:bg-purple-600 transition cursor-pointer"
                >
                  {league}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom Footer Links (Opcional) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Producto</h5>
              <ul className="space-y-1 text-gray-500 text-xs hover:text-gray-400 cursor-pointer">
                <li>Características</li>
                <li>Seguridad</li>
                <li>Actualizaciones</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Comunidad</h5>
              <ul className="space-y-1 text-gray-500 text-xs">
                <li className="hover:text-gray-400 cursor-pointer">Blog</li>
                <li className="hover:text-gray-400 cursor-pointer">Foro</li>
                <li className="hover:text-gray-400 cursor-pointer">Contacto</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Legal</h5>
              <ul className="space-y-1 text-gray-500 text-xs">
                <li className="hover:text-gray-400 cursor-pointer">Privacidad</li>
                <li className="hover:text-gray-400 cursor-pointer">Términos</li>
                <li className="hover:text-gray-400 cursor-pointer">Cookies</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Social</h5>
              <ul className="space-y-1 text-gray-500 text-xs">
                <li className="hover:text-gray-400 cursor-pointer">Twitter</li>
                <li className="hover:text-gray-400 cursor-pointer">Facebook</li>
                <li className="hover:text-gray-400 cursor-pointer">Instagram</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>{TEXTS.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;