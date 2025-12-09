// src/pages/Login/AuthButton.jsx
import React from 'react';

const AuthButton = ({
  type = 'submit',
  isLoading = false,
  loadingText = 'Cargando...',
  defaultText = 'Continuar',
  fullWidth = true,
  disabled = false,
  onClick,
  className = ''
}) => {
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''}
        py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-700 
        hover:opacity-90 text-white font-semibold rounded-lg 
        shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-purple-500 transition-all duration-200 
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        defaultText
      )}
    </button>
  );
};

export default AuthButton;