import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Importar useLocation
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getUserRole } from '../hooks/useAuthStatusAndRole';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); // 2. Obtener location
    const auth = getAuth();

    // 3. Buscar si venimos de una redirección (la quiniela compartida)
    const from = location.state?.from?.pathname || null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            
            // Obtener rol
            const role = await getUserRole(user.uid);

            // 4. Lógica de redirección inteligente
            if (from) {
                // Si había un link pendiente, vamos ahí (ej: /dashboard/user/play/xyz)
                navigate(from, { replace: true });
            } else {
                // Si entró directo al login, flujo normal
                if (role === 'admin') {
                    navigate('/dashboard/admin');
                } else {
                    navigate('/dashboard/user');
                }
            }

        } catch (error) {
            console.error("Login error:", error);
            setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
             {/* ... (El resto de tu diseño visual se mantiene igual) ... */}
             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* ... inputs ... */}
                        
                         {/* Botón de Login */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Iniciando sesión...' : 'Ingresar'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    ¿No tienes cuenta?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            {/* 5. (Opcional) Pasar el estado también al registro por si acaso */}
                            <Link 
                                to="/register" 
                                state={{ from: location.state?.from }}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;