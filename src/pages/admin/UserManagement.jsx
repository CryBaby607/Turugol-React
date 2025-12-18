import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import DashboardLayout from '../../components/DashboardLayout';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUserHistory, setSelectedUserHistory] = useState(null);

    // 1. Cargar listado maestro de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // 2. Función para ver historial (simulada según estructura de participaciones)
    const viewHistory = async (userId) => {
        setLoading(true);
        try {
            // Suponiendo una colección 'participaciones' que vincula user e info de quiniela
            const q = query(collection(db, 'participaciones'), where('userId', '==', userId));
            const snap = await getDocs(q);
            const history = snap.docs.map(doc => doc.data());
            setSelectedUserHistory({ userId, history });
        } catch (error) {
            console.error("Error al cargar historial:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Gestión de Usuarios">
            <div className="p-6">
                {/* Buscador */}
                <div className="mb-6">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o correo..." 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabla Maestra */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.displayName || 'Sin nombre'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={() => viewHistory(user.id)}
                                            className="text-blue-600 hover:text-blue-900 font-semibold"
                                        >
                                            Ver Historial
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal de Historial (Condicional) */}
                {selectedUserHistory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">Historial de Participación</h3>
                            {selectedUserHistory.history.length > 0 ? (
                                <ul className="space-y-3">
                                    {selectedUserHistory.history.map((h, i) => (
                                        <li key={i} className="p-3 bg-gray-50 rounded border">
                                            <p className="font-bold">{h.quinielaName}</p>
                                            <p className="text-sm text-gray-500">Puntaje: {h.puntos || 0} pts</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">Este usuario aún no ha participado en ninguna quiniela.</p>
                            )}
                            <button 
                                onClick={() => setSelectedUserHistory(null)}
                                className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserManagement;