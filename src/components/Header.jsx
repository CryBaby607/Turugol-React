import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuth = false }) => {
  return (
    <header className="sticky top-0 z-50 bg-black shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="p-2 rounded-lg font-bold text-2xl">
              <span className="text-white">TURI</span>
              <span className="text-emerald-500">GOL</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isAuth ? (
            <>
              <Link to="/login" className="text-white font-medium hover:text-emerald-400 transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <span className="text-white font-medium">Bienvenido, Usuario</span>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;