// src/pages/Login/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ type = 'error', title, message }) => {
  const styles = {
    error: 'border-red-200 bg-red-50',
    success: 'border-green-200 bg-green-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const icons = {
    error: (
      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  const textColors = {
    error: { title: 'text-red-800', message: 'text-red-600' },
    success: { title: 'text-green-800', message: 'text-green-600' },
    info: { title: 'text-blue-800', message: 'text-blue-600' }
  };

  return (
    <div className={`p-3 rounded-lg border ${styles[type]}`}>
      <div className="flex items-start">
        {icons[type]}
        <div>
          <p className={`font-medium text-sm ${textColors[type].title}`}>{title}</p>
          <p className={`text-sm mt-0.5 ${textColors[type].message}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;