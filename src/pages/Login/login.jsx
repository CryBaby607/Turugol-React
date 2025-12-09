import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import AuthLayout from './AuthLayout';
// CORREGIR ESTOS IMPORTS - ELIMINAR "shared/"
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import ErrorMessage from './ErrorMessage';
// Si validators.js no existe, elimina este import y define las funciones aquí

const Login = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // FUNCIONES DE VALIDACIÓN (si validators.js no existe)
  const validateEmail = (email) => {
    if (!email.trim()) return 'El correo electrónico es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Correo electrónico inválido';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Verificar email
      if (!user.emailVerified) {
        setServerError('Tu correo no ha sido verificado. Por favor, verifica tu correo antes de continuar.');
        setIsLoading(false);
        return;
      }
      
      // Guardar en localStorage
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseError = (error) => {
    const errorMessages = {
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/invalid-email': 'Correo electrónico inválido'
    };
    
    setServerError(errorMessages[error.code] || 'Error al iniciar sesión. Intenta nuevamente.');
  };

  const handleForgotPassword = () => {
    // Implementar recuperación de contraseña
    navigate('/reset-password');
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa a tu cuenta para continuar"
      icon={
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon="email"
          disabled={isLoading}
          autoFocus
        />
        
        <AuthInput
          label="Contraseña"
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon="password"
          disabled={isLoading}
        />
        
        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
            disabled={isLoading}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        
        {serverError && (
          <ErrorMessage
            type="error"
            title="Error de autenticación"
            message={serverError}
          />
        )}
        
        {successMessage && (
          <ErrorMessage
            type="success"
            title="¡Éxito!"
            message={successMessage}
          />
        )}
        
        <AuthButton
          type="submit"
          isLoading={isLoading}
          loadingText="Iniciando sesión..."
          defaultText="Iniciar Sesión"
          fullWidth
        />
        
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
              disabled={isLoading}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;