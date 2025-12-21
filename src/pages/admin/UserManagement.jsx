import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'; // 🔥 updateDoc agregado
import DashboardLayout from '../../components/DashboardLayout';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUserHistory, setSelectedUserHistory] = useState(null);
    const [updatingId, setUpdatingId] = useState(null); // Para mostrar loading en el botón específico

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

    // 🔥 Nueva función para cambiar estado de pago
    const togglePaymentStatus = async (userId, currentStatus) => {
        setUpdatingId(userId);
        try {
            const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, { 
                paymentStatus: newStatus,
                updatedAt: new Date().toISOString()
            });

            // Actualizar estado local para reflejar el cambio sin recargar
            setUsers(prevUsers => prevUsers.map(user => 
                user.id === userId ? { ...user, paymentStatus: newStatus } : user
            ));

        } catch (error) {
            console.error("Error actualizando pago:", error);
            alert("No se pudo actualizar el estado.");
        } finally {
            setUpdatingId(null);
        }
    };

    const viewHistory = async (userId) => {
        // (Lógica existente visualizando historial...)
        setLoading(true); 
        try {
            const q = query(collection(db, 'participaciones'), where('userId', '==', userId));
            const snap = await getDocs(q);
            const history = snap.docs.map(doc => doc.data());
            setSelectedUserHistory({ userId, history });
        } catch (error) {
            console.error("Error historial:", error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['bg-red-100 text-red-600', 'bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-yellow-100 text-yellow-600', 'bg-purple-100 text-purple-600'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    const filteredUsers = users.filter(u => 
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout isAdmin={true}>
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Directorio de Usuarios</h2>
                        <p className="text-gray-500">Administra accesos, roles y <span className="text-blue-600 font-bold">pagos</span>.</p>
                    </div>
                    
                    <div className="relative w-full md:w-96">
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o correo..." 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado de Pago</th> {/* 🔥 Nueva Columna */}
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Cargando usuarios...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">No se encontraron usuarios.</td></tr>
                                ) : (
                                    filteredUsers.map(user => {
                                        const name = user.displayName || 'Sin Nombre';
                                        const isPaid = user.paymentStatus === 'paid';
                                        
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(name)}`}>
                                                            {getInitials(name)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">{name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* 🔥 Columna de Pago Interactiva */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button 
                                                        onClick={() => togglePaymentStatus(user.id, user.paymentStatus)}
                                                        disabled={updatingId === user.id}
                                                        className={`
                                                            relative inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all
                                                            ${isPaid 
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                                                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'}
                                                            ${updatingId === user.id ? 'opacity-50 cursor-wait' : ''}
                                                        `}
                                                    >
                                                        {updatingId === user.id ? (
                                                            <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                                        ) : (
                                                            <i className={`fas ${isPaid ? 'fa-check-circle' : 'fa-clock'} mr-2`}></i>
                                                        )}
                                                        {isPaid ? 'MEMBRESÍA ACTIVA' : 'PAGO PENDIENTE'}
                                                    </button>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {user.role === 'admin' ? 'ADMIN' : 'USER'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => viewHistory(user.id)}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs"
                                                    >
                                                        Ver Historial
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de Historial (Sin cambios mayores) */}
                {selectedUserHistory && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fade-in">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Historial de Juego</h3>
                            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {selectedUserHistory.history.length > 0 ? (
                                    selectedUserHistory.history.map((h, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                            <span className="font-bold text-gray-700">{h.quinielaName || 'Quiniela #' + (i+1)}</span>
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${h.status === 'finalized' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                {h.status === 'finalized' ? `${h.puntos} pts` : 'Pendiente'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <i className="fas fa-ghost text-3xl mb-2"></i>
                                        <p>Este usuario aún no ha participado.</p>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => setSelectedUserHistory(null)}
                                className="mt-6 w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 font-medium transition-colors"
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