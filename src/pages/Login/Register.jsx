import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const phoneInputRef = useRef(null);

    // Validaciones
    const validateName = (name) => {
        if (!name.trim()) return 'El nombre es obligatorio';
        if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
    };

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

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Confirma tu contraseña';
        if (confirmPassword !== password) return 'Las contraseñas no coinciden';
        return '';
    };

    // Formatear número para mostrar (sin código internacional)
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        
        if (numbers.length === 0) return '';
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
    };

    // Manejo de cambios en inputs normales
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
        setServerError('');
        setSuccessMessage('');

        // Validación en tiempo real
        if (name === 'name') {
            const error = validateName(value);
            setErrors(prev => ({ ...prev, name: error || undefined }));
        } else if (name === 'password') {
            const error = validatePassword(value);
            setErrors(prev => ({ 
                ...prev, 
                password: error || undefined,
                confirmPassword: validateConfirmPassword(formData.confirmPassword, value) || undefined
            }));
        } else if (name === 'confirmPassword') {
            const error = validateConfirmPassword(value, formData.password);
            setErrors(prev => ({ ...prev, confirmPassword: error || undefined }));
        }
    };

    // Manejo especial para teléfono
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
        setServerError('');
        setSuccessMessage('');
    };

    // Efecto para manejar cursor en teléfono
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

    // Validar todo el formulario
    const validateForm = () => {
        const newErrors = {};

        newErrors.name = validateName(formData.name);
        newErrors.phone = validatePhone(formData.phone);
        newErrors.password = validatePassword(formData.password);
        newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);

        // Filtrar errores vacíos
        const filteredErrors = Object.fromEntries(
            Object.entries(newErrors).filter(([_, value]) => value !== '')
        );

        setErrors(filteredErrors);
        return Object.keys(filteredErrors).length === 0;
    };

    // Simular registro
    const simulateRegistration = async (data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular que el teléfono ya está registrado
                if (data.phone === '1234567890') {
                    reject(new Error('Este número de teléfono ya está registrado'));
                } else {
                    resolve({
                        success: true,
                        user: {
                            id: Math.floor(Math.random() * 1000),
                            name: data.name,
                            phone: data.phone
                        },
                        token: `token_${Date.now()}`
                    });
                }
            }, 1500);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await simulateRegistration(formData);
            
            setSuccessMessage('¡Registro exitoso! Redirigiendo...');
            
            // Guardar datos temporalmente
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userData', JSON.stringify(result.user));

            // Redirigir al login después de 1.5 segundos
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            setServerError(error.message);
            // Limpiar contraseñas en caso de error
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } finally {
            setIsLoading(false);
        }
    };

    // Valor formateado para mostrar
    const formattedPhone = formatPhoneNumber(formData.phone);

    return (
        <div className="flex items-center justify-center p-4 bg-gray-50">
            {/* Card compacta - tamaño óptimo */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Encabezado compacto */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-center rounded-t-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">
                        Crear Cuenta
                    </h2>
                    <p className="text-blue-100 text-xs">
                        Regístrate para comenzar
                    </p>
                </div>

                {/* Contenido del formulario - padding reducido */}
                <div className="p-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre completo */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    className="w-full px-3 py-2.5 pl-9 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && (
                                <div className="mt-1 flex items-center text-red-600 text-xs">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Número de teléfono */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de teléfono
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <input
                                    ref={phoneInputRef}
                                    id="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="333 123 4567"
                                    className="w-full px-3 py-2.5 pl-9 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={formattedPhone}
                                    onChange={handlePhoneChange}
                                    disabled={isLoading}
                                    maxLength="14"
                                />
                            </div>
                            {errors.phone && (
                                <div className="mt-1 flex items-center text-red-600 text-xs">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    className="w-full px-3 py-2.5 pl-9 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.password && (
                                <div className="mt-1 flex items-center text-red-600 text-xs">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirma tu contraseña"
                                    className="w-full px-3 py-2.5 pl-9 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <div className="mt-1 flex items-center text-red-600 text-xs">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.confirmPassword}</span>
                                </div>
                            )}
                        </div>

                        {/* Error del servidor */}
                        {serverError && (
                            <div className="p-2.5 rounded-md border border-red-200 bg-red-50 text-xs">
                                <div className="flex items-start">
                                    <svg className="w-3.5 h-3.5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-red-800">Error en el registro</p>
                                        <p className="text-red-600 mt-0.5">{serverError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensaje de éxito */}
                        {successMessage && (
                            <div className="p-2.5 rounded-md border border-green-200 bg-green-50 text-xs">
                                <div className="flex items-start">
                                    <svg className="w-3.5 h-3.5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-green-800">¡Registro exitoso!</p>
                                        <p className="text-green-600 mt-0.5">{successMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botón de registro */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-3"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creando cuenta...</span>
                                </div>
                            ) : (
                                'Crear Cuenta'
                            )}
                        </button>

                        {/* Enlace para iniciar sesión */}
                        <div className="text-center pt-3 border-t border-gray-200 mt-3">
                            <p className="text-gray-600 text-xs">
                                ¿Ya tienes cuenta?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Información de demo - más compacta */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5 text-blue-500 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p>
                            <span className="font-medium">Demo:</span> No uses <span className="font-bold">1234567890</span> (ya registrado)
                        </p>
                    </div>
                </div>

                {/* Footer más compacto */}
                <div className="px-5 py-2.5 bg-gray-100 border-t border-gray-200">
                    <p className="text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} QuinielasFútbol
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;