import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          {/* Columna 1: Logo, descripción y redes sociales */}
          <div className="lg:w-2/5">
            <div className="mb-8">
              <div className="p-2 rounded-lg font-bold text-2xl inline-block mb-4">
                <span className="text-white">TURI</span>
                <span className="text-emerald-500">GOL</span>
              </div>
              <p className="text-gray-400 max-w-md mb-8">
                La plataforma líder en quinielas de fútbol competitivas. Únete y demuestra tu conocimiento deportivo.
              </p>
              
              {/* Redes sociales */}
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Síguenos</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                    <i className="fab fa-tiktok"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna 2: Contacto */}
          <div className="lg:w-3/5">
            <div className="flex flex-col md:flex-row justify-between gap-10">
              {/* Contacto */}
              <div className="w-full md:w-1/2">
                <h4 className="text-lg font-bold mb-4 text-white">Contacto</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <i className="fas fa-envelope mt-1 mr-3 text-emerald-400"></i>
                    <span>info@turigol.com</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-phone mt-1 mr-3 text-emerald-400"></i>
                    <span>+34 900 123 456</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-map-marker-alt mt-1 mr-3 text-emerald-400"></i>
                    <span>Madrid, España</span>
                  </li>
                </ul>
              </div>
              
              {/* Enlaces rápidos */}
              <div className="w-full md:w-1/2">
                <h4 className="text-lg font-bold mb-4 text-white">Enlaces rápidos</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/" className="hover:text-emerald-400 transition-colors">Quinielas activas</Link></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Cómo funciona</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Términos y condiciones</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Política de privacidad</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; 2023 Turigol. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;