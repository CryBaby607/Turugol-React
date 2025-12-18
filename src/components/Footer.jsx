import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          {/* Columna 1: Logo y descripción */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <div className="p-2 rounded-lg font-bold text-2xl inline-block mb-4">
                <span className="text-white">TURU</span>
                <span className="text-emerald-500">GOL</span>
              </div>
              <p className="text-gray-400 max-w-md">
                La plataforma líder en quinielas de fútbol competitivas. Únete y demuestra tu conocimiento deportivo.
              </p>
            </div>
          </div>

          {/* Columna 2: Información de contacto */}
          <div className="lg:w-1/2 w-full flex lg:justify-end">
            <div className="w-full md:w-auto">
              <h4 className="text-lg font-bold mb-4 text-white">Contacto</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-3 text-emerald-400"></i>
                  <span>soporte@turugol.com</span>
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
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Turugol. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;