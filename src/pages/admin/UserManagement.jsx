import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Eliminé orderBy si no se usa en la query inicial
import DashboardLayout from '../../components/DashboardLayout';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUserHistory, setSelectedUserHistory] = useState(null);

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

    const viewHistory = async (userId) => {
        setLoading(true);
        try {
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

    // CORRECCIÓN: Filtrar por los campos reales (name y username)
    const filteredUsers = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout title="Gestión de Usuarios" isAdmin={true}>
            <div className="p-6">
                {/* Buscador */}
                <div className="mb-6">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre, usuario o correo..." 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabla Maestra */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                {/* Unificamos Nombre y Usuario en una sola columna */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                {/* Eliminada la columna de Rol */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            {/* Usamos user.name (Nombre real) */}
                                            <span className="font-medium text-gray-900">
                                                {user.name || 'Sin nombre'}
                                            </span>
                                            {/* Usamos user.username como subtítulo */}
                                            <span className="text-xs text-gray-500">
                                                @{user.username || 'sin_usuario'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {user.email}
                                    </td>
                                    {/* Eliminada la celda de Rol */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={() => viewHistory(user.id)}
                                            className="text-blue-600 hover:text-blue-900 font-semibold flex items-center gap-2"
                                        >
                                            <i className="fas fa-history"></i> Historial
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron usuarios con ese criterio.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal de Historial (Sin cambios mayores, solo visuales) */}
                {selectedUserHistory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Historial de Participación</h3>
                                <button onClick={() => setSelectedUserHistory(null)} className="text-gray-400 hover:text-gray-600">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            
                            {selectedUserHistory.history.length > 0 ? (
                                <ul className="space-y-3">
                                    {selectedUserHistory.history.map((h, i) => (
                                        <li key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                                            <span className="font-semibold text-gray-700">{h.quinielaName}</span>
                                            <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                {h.puntos || 0} pts
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-gray-500 italic">Este usuario aún no ha participado en ninguna quiniela.</p>
                                </div>
                            )}
                            
                            <button 
                                onClick={() => setSelectedUserHistory(null)}
                                className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
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