import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors'; // Ruta ajustada

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validaciones
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]+$/;
    if (!phone) return 'El número de teléfono es obligatorio';
    if (!phoneRegex.test(phone)) return 'Solo se permiten números';
    if (phone.length < 10) return 'El teléfono debe tener al menos 10 dígitos';
    if (phone.length > 12) return 'El teléfono no puede tener más de 12 dígitos';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    return '';
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 0) {
      if (numbers.length <= 3) {
        return `+${numbers}`;
      } else if (numbers.length <= 5) {
        return `+${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      } else if (numbers.length <= 8) {
        return `+${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5)}`;
      } else {
        return `+${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 12)}`;
      }
    }
    return '';
  };

  const handlePhoneChange = (e) => {
    const input = e.target;
    const originalCursorPosition = input.selectionStart;
    const formattedValue = formatPhoneNumber(input.value);
    const numbersOnly = formattedValue.replace(/\D/g, '');

    if (numbersOnly.length <= 12) {
      setFormData(prev => ({ ...prev, phone: numbersOnly }));
      
      // Validar en tiempo real
      const phoneError = validatePhone(numbersOnly);
      setErrors(prev => ({
        ...prev,
        phone: phoneError || undefined
      }));
    }

    setTimeout(() => {
      if (input) {
        const newCursorPosition = Math.max(0, originalCursorPosition + (formattedValue.length - input.value.length));
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, password: value }));
    
    // Validar en tiempo real
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
          resolve({ success: true, user: { id: 1, phone: data.phone } });
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
      console.log('Login exitoso:', result);
      
      // Guardar en localStorage
      localStorage.setItem('authToken', 'simulated_token');
      localStorage.setItem('userPhone', formData.phone);
      
      // Redirigir
      navigate('/');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener valor formateado para mostrar
  const formattedPhone = formatPhoneNumber(formData.phone);

  // Clases reutilizables usando tu sistema de colores
  const inputBaseClasses = cn(
    COLOR_CLASSES.components.input.base,
    "w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-200"
  );

  const inputErrorClasses = cn(inputBaseClasses, COLOR_CLASSES.components.input.error);
  
  const labelClasses = "block text-sm font-medium mb-2";

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${HEX_COLORS.primary}10 0%, ${HEX_COLORS.secondary}10 100%)`
      }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className={cn(
          COLOR_CLASSES.components.card.elevated,
          "p-8 md:p-10"
        )}>
          {/* Logo y título */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <div 
                className={cn(
                  "p-4 rounded-2xl shadow-lg",
                  COLOR_CLASSES.backgrounds.white
                )}
                style={{
                  border: `2px solid ${HEX_COLORS.primary}20`
                }}
              >
                <span className="text-4xl" style={{ color: HEX_COLORS.primary }}>
                  🔐
                </span>
              </div>
            </div>

            <h2 
              className="text-3xl font-bold mb-2"
              style={{ color: HEX_COLORS.textDark }}
            >
              Iniciar Sesión
            </h2>
            <p style={{ color: HEX_COLORS.textLight }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Número de teléfono */}
            <div>
              <label 
                htmlFor="phone" 
                className={labelClasses}
                style={{ color: HEX_COLORS.textDark }}
              >
                Número de teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span style={{ color: HEX_COLORS.textMuted }}>📱</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="+123 45 678 9012"
                  className={errors.phone ? inputErrorClasses : inputBaseClasses}
                  value={formattedPhone}
                  onChange={handlePhoneChange}
                  disabled={isLoading}
                  style={{
                    borderColor: errors.phone ? HEX_COLORS.error : HEX_COLORS.borderGray,
                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                  }}
                />
              </div>
              {errors.phone && (
                <div 
                  className="mt-2 text-sm flex items-center"
                  style={{ color: HEX_COLORS.error }}
                >
                  <span className="mr-1">⚠️</span>
                  {errors.phone}
                </div>
              )}
              <p 
                className="mt-1 text-xs"
                style={{ color: HEX_COLORS.textMuted }}
              >
                Solo números, entre 10 y 12 dígitos
              </p>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="password" 
                  className={labelClasses}
                  style={{ color: HEX_COLORS.textDark }}
                >
                  Contraseña
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm hover:underline transition-colors"
                  style={{ color: HEX_COLORS.primary }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span style={{ color: HEX_COLORS.textMuted }}>🔒</span>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={errors.password ? inputErrorClasses : inputBaseClasses}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  style={{
                    borderColor: errors.password ? HEX_COLORS.error : HEX_COLORS.borderGray,
                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                  }}
                />
              </div>
              {errors.password && (
                <div 
                  className="mt-2 text-sm flex items-center"
                  style={{ color: HEX_COLORS.error }}
                >
                  <span className="mr-1">⚠️</span>
                  {errors.password}
                </div>
              )}
              <p 
                className="mt-1 text-xs"
                style={{ color: HEX_COLORS.textMuted }}
              >
                Mínimo 8 caracteres
              </p>
            </div>

            {/* Error del servidor */}
            {serverError && (
              <div
                className="p-4 rounded-lg border flex items-start space-x-3"
                style={{
                  backgroundColor: HEX_COLORS.error + '10',
                  borderColor: HEX_COLORS.error + '30',
                  color: HEX_COLORS.error,
                }}
              >
                <span className="text-lg mt-0.5">⛔</span>
                <div>
                  <p className="font-medium">Error de autenticación</p>
                  <p className="text-sm mt-1">{serverError}</p>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "transition-all duration-200 transform hover:-translate-y-0.5",
                "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
                COLOR_CLASSES.components.button.primary
              )}
              style={{
                background: `linear-gradient(135deg, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`,
                boxShadow: `0 4px 14px 0 ${HEX_COLORS.primary}40`,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px 0 ${HEX_COLORS.primary}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 14px 0 ${HEX_COLORS.primary}40`;
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></div>
                  <span>Verificando credenciales...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">→</span>
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </button>

            {/* Enlace a registro */}
            <div 
              className="text-center pt-6 border-t"
              style={{ borderColor: HEX_COLORS.borderGray }}
            >
              <p 
                className="text-sm"
                style={{ color: HEX_COLORS.textLight }}
              >
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: HEX_COLORS.primary }}
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>

          {/* Información adicional */}
          <div 
            className="mt-8 pt-6"
            style={{ borderColor: HEX_COLORS.borderGray }}
          >
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: HEX_COLORS.primary + '10',
                border: `1px solid ${HEX_COLORS.primary}30`,
              }}
            >
              <div className="flex items-start">
                <span 
                  className="mr-2 mt-0.5"
                  style={{ color: HEX_COLORS.primary }}
                >
                  ℹ️
                </span>
                <div>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: HEX_COLORS.textDark }}
                  >
                    Información de acceso
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: HEX_COLORS.textMuted }}
                  >
                    Para probar: usa 1234567890 y contraseña "password123"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p 
            className="text-sm"
            style={{ color: HEX_COLORS.textMuted }}
          >
            © {new Date().getFullYear()} QuinielasFútbol. Todos los derechos reservados.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <Link
              to="/terms"
              className="text-xs hover:underline transition-colors"
              style={{ color: HEX_COLORS.textMuted }}
            >
              Términos
            </Link>
            <Link
              to="/privacy"
              className="text-xs hover:underline transition-colors"
              style={{ color: HEX_COLORS.textMuted }}
            >
              Privacidad
            </Link>
            <Link
              to="/help"
              className="text-xs hover:underline transition-colors"
              style={{ color: HEX_COLORS.textMuted }}
            >
              Ayuda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;