import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../firebase/config';

const Login = () => {
  const navigate = useNavigate();
  
  // Estados para manejar el modo (login o registro)
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Estados para formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Estados para formulario de registro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Estados compartidos
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        console.log('Usuario autenticado:', user.email, 'Verificado:', user.emailVerified);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Validaciones para login
  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    
    if (!loginData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validaciones para registro
  const validateRegisterForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!registerData.name.trim()) {
      newErrors.name = 'El nombre completo es obligatorio';
    } else if (registerData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar email
    if (!registerData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    
    // Validar contraseña
    if (!registerData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      if (registerData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      if (!/(?=.*[A-Z])/.test(registerData.password)) {
        newErrors.password = 'Debe contener al menos una mayúscula';
      }
      if (!/(?=.*\d)/.test(registerData.password)) {
        newErrors.password = 'Debe contener al menos un número';
      }
    }
    
    // Validar confirmación de contraseña
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setServerError('');
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejar cambios en registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    setServerError('');
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Función para iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    
    if (!validateLoginForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Intentando iniciar sesión con:', loginData.email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      
      const user = userCredential.user;
      console.log('Usuario autenticado:', {
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName
      });
      
      // Verificar si el correo está verificado
      if (!user.emailVerified) {
        console.log('Correo NO verificado. Ofreciendo reenviar verificación...');
        
        // No cerrar sesión automáticamente
        setServerError('Tu correo electrónico no ha sido verificado. Por favor, verifica tu correo antes de continuar.');
        
        // Mostrar opción para reenviar verificación
        setPendingVerificationEmail(user.email);
        setSuccessMessage('');
        
        setIsLoading(false);
        return;
      }
      
      console.log('Correo verificado, procediendo con login...');
      
      // Guardar datos en localStorage
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }));
      
      setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrar usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    setVerificationSent(false);
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Registrando usuario:', registerData.email);
      
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );
      
      const user = userCredential.user;
      console.log('Usuario creado:', user.uid);
      
      // Actualizar perfil con el nombre
      try {
        await updateProfile(user, {
          displayName: registerData.name
        });
        console.log('Perfil actualizado con nombre:', registerData.name);
      } catch (profileError) {
        console.warn('Error al actualizar perfil:', profileError);
      }
      
      // Enviar email de verificación
      console.log('Enviando correo de verificación a:', user.email);
      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      console.log('Correo de verificación enviado exitosamente');
      
      // Mostrar mensaje de éxito
      setVerificationSent(true);
      setPendingVerificationEmail(registerData.email);
      setSuccessMessage(`
        ¡Registro exitoso! 
        Se ha enviado un correo de verificación a ${registerData.email}. 
        Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
      `);
      
      // NO cerrar sesión inmediatamente - dejar que el usuario pueda reenviar el correo
      // El usuario permanecerá autenticado pero no podrá acceder hasta verificar
      
      // Limpiar formulario
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Cambiar a modo login después de 8 segundos
      setTimeout(() => {
        setIsRegisterMode(false);
      }, 8000);
      
    } catch (error) {
      console.error('Registration error:', error.code, error.message);
      handleFirebaseError(error);
      
      // Limpiar contraseñas en caso de error
      setRegisterData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reenviar verificación
  const handleResendVerification = async () => {
    const emailToResend = pendingVerificationEmail || (currentUser ? currentUser.email : '');
    
    if (!emailToResend) {
      setServerError('No hay correo electrónico para reenviar verificación.');
      return;
    }
    
    setIsLoading(true);
    setServerError('');
    
    try {
      let user = currentUser;
      
      // Si no hay usuario autenticado, intentar iniciar sesión
      if (!user && loginData.email && loginData.password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
          user = userCredential.user;
        } catch (error) {
          console.log('No se pudo autenticar para reenviar:', error);
        }
      }
      
      if (user) {
        console.log('Reenviando verificación a:', user.email);
        await sendEmailVerification(user, {
          url: window.location.origin + '/login',
          handleCodeInApp: false
        });
        
        setVerificationSent(true);
        setSuccessMessage(`Se ha reenviado el correo de verificación a ${user.email}. Por favor, revisa tu bandeja de entrada.`);
        setServerError('');
      } else {
        setServerError('No se pudo reenviar la verificación. Por favor, intenta iniciar sesión nuevamente.');
      }
    } catch (error) {
      console.error('Error al reenviar verificación:', error);
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar errores de Firebase
  const handleFirebaseError = (error) => {
    let errorMessage = 'Ocurrió un error. Por favor, intenta nuevamente.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo electrónico ya está registrado.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido.';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este correo.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos. Por favor, espera unos minutos.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'El registro con email/contraseña no está habilitado. Contacta al administrador.';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Esta operación requiere que inicies sesión nuevamente.';
        break;
      default:
        errorMessage = error.message || `Error: ${error.code}`;
    }
    
    setServerError(errorMessage);
  };

  // Cambiar entre login y registro
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrors({});
    setServerError('');
    setSuccessMessage('');
    setVerificationSent(false);
    setPendingVerificationEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Encabezado */}
          <div className="p-8 text-center bg-gradient-to-r from-purple-600 to-violet-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              {isRegisterMode ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="text-white/80 text-base">
              {isRegisterMode 
                ? 'Regístrate para comenzar' 
                : 'Ingresa a tu cuenta'
              }
            </p>
          </div>

          {/* Contenido del formulario */}
          <div className="p-8">
            {/* Mensaje de verificación pendiente */}
            {verificationSent && (
              <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-800 text-sm">¡Correo de verificación enviado!</p>
                    <p className="text-blue-600 text-sm mt-1">
                      Revisa tu bandeja de entrada (y carpeta de spam) en <strong>{pendingVerificationEmail}</strong> 
                      y haz clic en el enlace para verificar tu cuenta.
                    </p>
                    <div className="mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        disabled={isLoading}
                      >
                        ¿No recibiste el correo? Reenviar
                      </button>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline font-medium"
                      >
                        Ya verifiqué mi correo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isRegisterMode ? (
              // Formulario de Registro
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Nombre completo */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Juan Pérez"
                      className={`
                        w-full px-4 py-3 pl-10 rounded-lg border bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}
                      `}
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                  {errors.name && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Correo electrónico */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className={`
                        w-full px-4 py-3 pl-10 rounded-lg border bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      `}
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres con mayúscula y número"
                      className={`
                        w-full px-4 py-3 pl-10 rounded-lg border bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}
                      `}
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      disabled={isLoading}
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
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Requisitos de contraseña:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li className={registerData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                        Mínimo 8 caracteres
                      </li>
                      <li className={/(?=.*[A-Z])/.test(registerData.password) ? 'text-green-600' : 'text-gray-400'}>
                        Al menos una mayúscula
                      </li>
                      <li className={/(?=.*\d)/.test(registerData.password) ? 'text-green-600' : 'text-gray-400'}>
                        Al menos un número
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirma tu contraseña"
                      className={`
                        w-full px-4 py-3 pl-10 rounded-lg border bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200
                        ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                      `}
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.confirmPassword}</span>
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
                        <p className="font-medium text-red-800 text-sm">Error</p>
                        <p className="text-red-600 text-sm mt-0.5">{serverError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón de registro */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-700 hover:opacity-90 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>

                {/* Enlace para cambiar a login */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                      disabled={isLoading}
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              // Formulario de Login
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Correo electrónico */}
                <div>
                  <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-800 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      id="loginEmail"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className={`
                        w-full px-4 py-3 pl-10 rounded-lg border bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      `}
                      value={loginData.email}
                      onChange={handleLoginChange}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-800 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      id="loginPassword"
                      name="password"
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      className={`
                        w-full px-4 py-3 pl-10 rounded-lg border bg-white text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}
                      `}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      disabled={isLoading}
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
                {serverError && !verificationSent && (
                  <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium text-red-800 text-sm">Error de autenticación</p>
                        <p className="text-red-600 text-sm mt-0.5">{serverError}</p>
                        {serverError.includes('verifica tu correo') && (
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Reenviar correo de verificación
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensaje de éxito */}
                {successMessage && !verificationSent && (
                  <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium text-green-800 text-sm">¡Éxito!</p>
                        <p className="text-green-600 text-sm mt-0.5">{successMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón de login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-700 hover:opacity-90 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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

                {/* Enlace para cambiar a registro */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                      disabled={isLoading}
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Información */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm">
                {isRegisterMode 
                  ? 'Tu contraseña debe ser segura y única para esta plataforma.' 
                  : 'Asegúrate de verificar tu correo electrónico antes de iniciar sesión.'
                }
              </p>
            </div>
          </div>

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

export default Login;