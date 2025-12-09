// src/pages/Login/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Encabezado */}
          <div className="p-8 text-center bg-gradient-to-r from-purple-600 to-violet-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              {icon}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-white/80 text-base">{subtitle}</p>
          </div>

          {/* Contenido */}
          <div className="p-8">{children}</div>

          {/* Footer */}
          <div className="px-8 py-3 bg-gray-100 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} QuinielasFútbol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;