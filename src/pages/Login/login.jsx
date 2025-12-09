import React, { useState, useRef, useEffect } from 'react';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const Login = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const phoneInputRef = useRef(null);

  // Validaciones - EXACTAMENTE 10 dígitos
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]+$/;
    if (!phone) return 'El número de teléfono es obligatorio';
    if (!phoneRegex.test(phone)) return 'Solo se permiten números';
    if (phone.length !== 10) return 'El teléfono debe tener exactamente 10 dígitos';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    return '';
  };

  // Formatear número para mostrar
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  // Manejar cambio en el input de teléfono
  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    
    let numbersOnly = inputValue.replace(/\D/g, '');
    
    // Limitar a 10 dígitos EXACTOS
    if (numbersOnly.length > 10) {
      numbersOnly = numbersOnly.substring(0, 10);
    }
    
    setFormData(prev => ({ ...prev, phone: numbersOnly }));
    
    const phoneError = validatePhone(numbersOnly);
    setErrors(prev => ({
      ...prev,
      phone: phoneError || undefined
    }));
  };

  useEffect(() => {
    if (phoneInputRef.current) {
      const currentPos = phoneInputRef.current.selectionStart;
      const oldValue = phoneInputRef.current.value;
      const newValue = formatPhoneNumber(formData.phone);
      
      if (oldValue !== newValue && currentPos) {
        let newCursorPos = currentPos;
        
        if (newValue.length > oldValue.length) {
          const diff = newValue.length - oldValue.length;
          newCursorPos = currentPos + diff;
        } else if (newValue.length < oldValue.length) {
          const diff = oldValue.length - newValue.length;
          newCursorPos = Math.max(0, currentPos - diff);
        }
        
        setTimeout(() => {
          phoneInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }
    }
  }, [formData.phone]);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, password: value }));
    
    const passwordError = validatePassword(value);
    setErrors(prev => ({
      ...prev,
      password: passwordError || undefined
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);

    if (phoneError) newErrors.phone = phoneError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateLogin = async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.phone === '1234567890' && data.password === 'password123') {
          resolve({ 
            success: true, 
            user: { 
              id: 1, 
              phone: data.phone,
              name: 'Usuario Demo'
            },
            token: 'demo_token_12345'
          });
        } else {
          reject(new Error('Credenciales incorrectas. Verifica tu número y contraseña.'));
        }
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await simulateLogin(formData);
      
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userData', JSON.stringify(result.user));
      
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
      
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 500);
    } catch (error) {
      setServerError(error.message);
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Función de recuperación de contraseña en desarrollo.');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  // Valor formateado para mostrar
  const formattedPhone = formatPhoneNumber(formData.phone);

  return (
    <div className="flex items-center justify-center p-4 bg-white">
      {/* Card compacta - sin altura forzada */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Iniciar Sesión
          </h2>
          <p className="text-blue-100 text-sm">
            Ingresa con tu número de teléfono
          </p>
        </div>

        {/* Contenido del formulario */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5" onKeyPress={handleKeyPress}>
            {/* Número de teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Número de teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <input
                  ref={phoneInputRef}
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="333 123 4567"
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formattedPhone}
                  onChange={handlePhoneChange}
                  onBlur={() => {
                    if (formData.phone) {
                      const phoneError = validatePhone(formData.phone);
                      if (phoneError) {
                        setErrors(prev => ({ ...prev, phone: phoneError }));
                      }
                    }
                  }}
                  disabled={isLoading}
                  autoFocus
                  autoComplete="tel"
                  maxLength="14"
                />
              </div>
              {errors.phone && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  onBlur={() => {
                    if (formData.password) {
                      const passwordError = validatePassword(formData.password);
                      if (passwordError) {
                        setErrors(prev => ({ ...prev, password: passwordError }));
                      }
                    }
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Error del servidor */}
            {serverError && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-800 text-sm">Error de autenticación</p>
                    <p className="text-red-600 text-sm mt-0.5">{serverError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading || !formData.phone || !formData.password}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Enlace a registro */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  disabled={isLoading}
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Información de demo */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xs">
              <span className="font-medium">Demo:</span> Usa <span className="font-bold">1234567890</span> y contraseña <span className="font-bold">password123</span>
            </p>
          </div>
        </div>

        {/* Footer simplificado */}
        <div className="px-6 py-3 bg-gray-100 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} QuinielasFútbol
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;