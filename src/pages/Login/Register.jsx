import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLOR_CLASSES, cn, HEX_COLORS } from '../../constants/colors';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Validaciones
    const validateName = (name) => {
        if (!name.trim()) return 'El nombre es obligatorio';
        if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (name.length > 50) return 'El nombre es demasiado largo';
        return '';
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]+$/;
        if (!phone) return 'El número de teléfono es obligatorio';
        if (!phoneRegex.test(phone)) return 'Solo se permiten números';
        if (phone.length < 10) return 'El teléfono debe tener al menos 10 dígitos';
        if (phone.length > 12) return 'El teléfono no puede tener más de 12 dígitos';
        return '';
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'El correo electrónico es obligatorio';
        if (!emailRegex.test(email)) return 'Correo electrónico inválido';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'La contraseña es obligatoria';
        if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/(?=.*[A-Z])/.test(password)) return 'Debe contener al menos una mayúscula';
        if (!/(?=.*[0-9])/.test(password)) return 'Debe contener al menos un número';
        return '';
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return 'Confirma tu contraseña';
        if (confirmPassword !== formData.password) return 'Las contraseñas no coinciden';
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

    // Manejo de cambios
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setServerError('');
        setSuccessMessage('');

        // Validación en tiempo real para campos específicos
        if (name === 'name') {
            const error = validateName(newValue);
            if (error) setErrors(prev => ({ ...prev, name: error }));
        } else if (name === 'email') {
            const error = validateEmail(newValue);
            if (error) setErrors(prev => ({ ...prev, email: error }));
        } else if (name === 'password') {
            const error = validatePassword(newValue);
            if (error) setErrors(prev => ({ ...prev, password: error }));
        } else if (name === 'confirmPassword') {
            const error = validateConfirmPassword(newValue);
            if (error) setErrors(prev => ({ ...prev, confirmPassword: error }));
        }
    };

    const handlePhoneChange = (e) => {
        const input = e.target;
        const originalCursorPosition = input.selectionStart;
        const formattedValue = formatPhoneNumber(input.value);
        const numbersOnly = formattedValue.replace(/\D/g, '');

        if (numbersOnly.length <= 12) {
            setFormData(prev => ({ ...prev, phone: numbersOnly }));

            const phoneError = validatePhone(numbersOnly);
            if (phoneError) {
                setErrors(prev => ({ ...prev, phone: phoneError }));
            } else {
                setErrors(prev => ({ ...prev, phone: '' }));
            }
        }

        setTimeout(() => {
            if (input) {
                const newCursorPosition = Math.max(0, originalCursorPosition + (formattedValue.length - input.value.length));
                input.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        }, 0);
    };

    // Validar todo el formulario
    const validateForm = () => {
        const newErrors = {};

        newErrors.name = validateName(formData.name);
        newErrors.phone = validatePhone(formData.phone);
        newErrors.email = validateEmail(formData.email);
        newErrors.password = validatePassword(formData.password);
        newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword);

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
        }

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
                            phone: data.phone,
                            email: data.email
                        }
                    });
                }
            }, 2000);
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
            console.log('Registro exitoso:', result);

            setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');

            // Guardar datos temporalmente
            localStorage.setItem('registeredUser', JSON.stringify(result.user));

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setServerError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Obtener valor formateado para mostrar
    const formattedPhone = formatPhoneNumber(formData.phone);

    // Clases reutilizables
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
            <div className="w-full max-w-2xl">
                {/* Card */}
                <div className={cn(
                    COLOR_CLASSES.components.card.elevated,
                    "overflow-hidden"
                )}>
                    <div className="md:flex">
                        {/* Panel izquierdo - Imagen/Info */}
                        <div
                            className="md:w-2/5 p-8 md:p-10 text-white"
                            style={{
                                background: `linear-gradient(135deg, ${HEX_COLORS.primary}, ${HEX_COLORS.secondary})`
                            }}
                        >
                            <div className="h-full flex flex-col justify-center">
                                <div className="mb-8">
                                    <div
                                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                    >
                                        <span className="text-3xl">⚽</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">
                                        Únete a QuinielasFútbol
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>
                                        Crea tu cuenta y comienza a disfrutar de pronósticos deportivos sin apuestas.
                                    </p>
                                </div>

                                <div className="space-y-4 mt-8">
                                    <div className="flex items-start">
                                        <span className="mr-3 mt-1">✅</span>
                                        <div>
                                            <p className="font-semibold">Pronósticos gratis</p>
                                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                Sin costo de participación
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="mr-3 mt-1">✅</span>
                                        <div>
                                            <p className="font-semibold">Competencia sana</p>
                                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                Demuestra tus conocimientos
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="mr-3 mt-1">✅</span>
                                        <div>
                                            <p className="font-semibold">Múltiples ligas</p>
                                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                Pronostica en diversas competiciones
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                        ¿Ya tienes una cuenta?
                                    </p>
                                    <Link
                                        to="/login"
                                        className="inline-block mt-3 px-6 py-2 bg-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                        style={{ color: HEX_COLORS.primary }}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Panel derecho - Formulario */}
                        <div className="md:w-3/5 p-8 md:p-10">
                            <div className="mb-8">
                                <h2
                                    className="text-3xl font-bold mb-2"
                                    style={{ color: HEX_COLORS.textDark }}
                                >
                                    Crear Cuenta
                                </h2>
                                <p style={{ color: HEX_COLORS.textLight }}>
                                    Completa tus datos para registrarte
                                </p>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Nombre completo */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className={labelClasses}
                                        style={{ color: HEX_COLORS.textDark }}
                                    >
                                        Nombre completo *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Juan Pérez"
                                        className={errors.name ? inputErrorClasses : inputBaseClasses}
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        style={{
                                            borderColor: errors.name ? HEX_COLORS.error : HEX_COLORS.borderGray,
                                            backgroundColor: isLoading ? '#f9fafb' : 'white'
                                        }}
                                    />
                                    {errors.name && (
                                        <div
                                            className="mt-2 text-sm flex items-center"
                                            style={{ color: HEX_COLORS.error }}
                                        >
                                            <span className="mr-1">⚠️</span>
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Teléfono y Email en fila en pantallas grandes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Teléfono */}
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className={labelClasses}
                                            style={{ color: HEX_COLORS.textDark }}
                                        >
                                            Teléfono *
                                        </label>
                                        <div className="relative">
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
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span style={{ color: HEX_COLORS.textMuted }}>📱</span>
                                            </div>
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
                                            10-12 dígitos, solo números
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className={labelClasses}
                                            style={{ color: HEX_COLORS.textDark }}
                                        >
                                            Correo electrónico *
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="usuario@ejemplo.com"
                                                className={errors.email ? inputErrorClasses : inputBaseClasses}
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                style={{
                                                    borderColor: errors.email ? HEX_COLORS.error : HEX_COLORS.borderGray,
                                                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span style={{ color: HEX_COLORS.textMuted }}>✉️</span>
                                            </div>
                                        </div>
                                        {errors.email && (
                                            <div
                                                className="mt-2 text-sm flex items-center"
                                                style={{ color: HEX_COLORS.error }}
                                            >
                                                <span className="mr-1">⚠️</span>
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contraseña y Confirmar en fila */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Contraseña */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className={labelClasses}
                                            style={{ color: HEX_COLORS.textDark }}
                                        >
                                            Contraseña *
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className={errors.password ? inputErrorClasses : inputBaseClasses}
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                style={{
                                                    borderColor: errors.password ? HEX_COLORS.error : HEX_COLORS.borderGray,
                                                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span style={{ color: HEX_COLORS.textMuted }}>🔒</span>
                                            </div>
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
                                            Mínimo 8 caracteres, 1 mayúscula, 1 número
                                        </p>
                                    </div>

                                    {/* Confirmar Contraseña */}
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className={labelClasses}
                                            style={{ color: HEX_COLORS.textDark }}
                                        >
                                            Confirmar contraseña *
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className={errors.confirmPassword ? inputErrorClasses : inputBaseClasses}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                style={{
                                                    borderColor: errors.confirmPassword ? HEX_COLORS.error : HEX_COLORS.borderGray,
                                                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span style={{ color: HEX_COLORS.textMuted }}>🔒</span>
                                            </div>
                                        </div>
                                        {errors.confirmPassword && (
                                            <div
                                                className="mt-2 text-sm flex items-center"
                                                style={{ color: HEX_COLORS.error }}
                                            >
                                                <span className="mr-1">⚠️</span>
                                                {errors.confirmPassword}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Términos y condiciones */}
                                <div className="pt-4">
                                    <div className="flex items-start">
                                        <input
                                            id="acceptTerms"
                                            name="acceptTerms"
                                            type="checkbox"
                                            checked={formData.acceptTerms}
                                            onChange={handleChange}
                                            className={cn(
                                                "h-5 w-5 mt-0.5 rounded focus:outline-none focus:ring-2 focus:ring-offset-2",
                                                errors.acceptTerms ? 'border-red-500' : 'border-gray-300'
                                            )}
                                            style={{
                                                accentColor: HEX_COLORS.primary
                                            }}
                                            disabled={isLoading}
                                        />
                                        <label
                                            htmlFor="acceptTerms"
                                            className="ml-3 text-sm"
                                            style={{ color: HEX_COLORS.textDark }}
                                        >
                                            Acepto los{' '}
                                            <Link
                                                to="/terms"
                                                className="font-medium hover:underline"
                                                style={{ color: HEX_COLORS.primary }}
                                            >
                                                Términos y Condiciones
                                            </Link>{' '}
                                            y la{' '}
                                            <Link
                                                to="/privacy"
                                                className="font-medium hover:underline"
                                                style={{ color: HEX_COLORS.primary }}
                                            >
                                                Política de Privacidad
                                            </Link>
                                        </label>
                                    </div>
                                    {errors.acceptTerms && (
                                        <div
                                            className="mt-2 text-sm flex items-center"
                                            style={{ color: HEX_COLORS.error }}
                                        >
                                            <span className="mr-1">⚠️</span>
                                            {errors.acceptTerms}
                                        </div>
                                    )}
                                </div>

                                {/* Mensajes de éxito/error */}
                                {successMessage && (
                                    <div
                                        className="p-4 rounded-lg border flex items-start space-x-3"
                                        style={{
                                            backgroundColor: HEX_COLORS.success + '10',
                                            borderColor: HEX_COLORS.success + '30',
                                            color: HEX_COLORS.success,
                                        }}
                                    >
                                        <span className="text-lg mt-0.5">✅</span>
                                        <div>
                                            <p className="font-medium">¡Registro exitoso!</p>
                                            <p className="text-sm mt-1">{successMessage}</p>
                                        </div>
                                    </div>
                                )}

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
                                            <p className="font-medium">Error en el registro</p>
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
                                        "mt-6"
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
                                            <span>Creando cuenta...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span className="mr-2">📝</span>
                                            <span>Crear Cuenta</span>
                                        </div>
                                    )}
                                </button>
                            </form>

                            {/* Enlace de vuelta al login */}
                            <div
                                className="mt-8 pt-6 text-center"
                                style={{ borderColor: HEX_COLORS.borderGray }}
                            >
                                <p
                                    className="text-sm"
                                    style={{ color: HEX_COLORS.textLight }}
                                >
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link
                                        to="/login"
                                        className="font-semibold hover:underline"
                                        style={{ color: HEX_COLORS.primary }}
                                    >
                                        Inicia sesión aquí
                                    </Link>
                                </p>
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
                        © {new Date().getFullYear()} QuinielasFútbol. Solo para mayores de 18 años.
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-4">
                        <Link
                            to="/terms"
                            className="text-xs hover:underline"
                            style={{ color: HEX_COLORS.textMuted }}
                        >
                            Términos
                        </Link>
                        <Link
                            to="/privacy"
                            className="text-xs hover:underline"
                            style={{ color: HEX_COLORS.textMuted }}
                        >
                            Privacidad
                        </Link>
                        <Link
                            to="/help"
                            className="text-xs hover:underline"
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

export default Register;