import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import AuthLayout from './AuthLayout';
// CORREGIR ESTOS IMPORTS - ELIMINAR "shared/"
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import ErrorMessage from './ErrorMessage';
// Si validators.js no existe, puedes eliminar este import o crear el archivo
// import { 
//   validateEmail, 
//   validatePassword,
//   validateName,
//   validateConfirmPassword 
// } from '../../utils/validators';

const Register = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  // FUNCIONES DE VALIDACIÓN (si no existe validators.js)
  const validateName = (name) => {
    if (!name.trim()) return 'El nombre es obligatorio';
    if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'El correo electrónico es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Correo electrónico inválido';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'Debe tener al menos 8 caracteres';
    if (!/(?=.*[A-Z])/.test(password)) return 'Debe contener al menos una mayúscula';
    if (!/(?=.*\d)/.test(password)) return 'Debe contener al menos un número';
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmError) newErrors.confirmPassword = confirmError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    setVerificationSent(false);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Crear usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Actualizar perfil con nombre
      await updateProfile(user, {
        displayName: formData.name
      });
      
      // Enviar verificación
      await sendEmailVerification(user, {
        url: window.location.origin + '/login'
      });
      
      // Mostrar éxito
      setVerificationSent(true);
      setSuccessMessage(`Se ha enviado un correo de verificación a ${formData.email}.`);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Cambiar a login después de 5 segundos
      setTimeout(() => {
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          navigate('/login');
        }
      }, 5000);
      
    } catch (error) {
      handleFirebaseError(error);
      // Limpiar contraseñas en error
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseError = (error) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/weak-password': 'La contraseña es demasiado débil',
      'auth/operation-not-allowed': 'Registro no habilitado',
      'auth/network-request-failed': 'Error de conexión'
    };
    
    setServerError(errorMessages[error.code] || 'Error al crear la cuenta. Intenta nuevamente.');
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Regístrate para comenzar"
      icon={
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Nombre completo"
          type="text"
          name="name"
          placeholder="Juan Pérez"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon="user"
          disabled={isLoading}
          autoFocus
        />
        
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
        />
        
        <AuthInput
          label="Contraseña"
          type="password"
          name="password"
          placeholder="Mínimo 8 caracteres con mayúscula y número"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon="password"
          disabled={isLoading}
        />
        
        <div className="mt-2 text-xs text-gray-500">
          <p className="font-medium mb-1">Requisitos:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
              Mínimo 8 caracteres
            </li>
            <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
              Al menos una mayúscula
            </li>
            <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
              Al menos un número
            </li>
          </ul>
        </div>
        
        <AuthInput
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          placeholder="Confirma tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon="confirm"
          disabled={isLoading}
        />
        
        {verificationSent && (
          <ErrorMessage
            type="info"
            title="¡Verificación enviada!"
            message={`Revisa tu bandeja de entrada (y spam) en ${formData.email || 'tu correo'}.`}
          />
        )}
        
        {serverError && (
          <ErrorMessage
            type="error"
            title="Error al registrar"
            message={serverError}
          />
        )}
        
        {successMessage && !verificationSent && (
          <ErrorMessage
            type="success"
            title="¡Éxito!"
            message={successMessage}
          />
        )}
        
        <AuthButton
          type="submit"
          isLoading={isLoading}
          loadingText="Creando cuenta..."
          defaultText="Crear Cuenta"
          fullWidth
        />
        
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
              disabled={isLoading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;