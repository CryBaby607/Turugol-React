import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // 🔥 Imports BD
import DashboardLayout from '../../components/DashboardLayout';

const UserProfile = () => {
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [paymentStatus, setPaymentStatus] = useState('loading'); // loading, paid, pending
    const [saving, setSaving] = useState(false);

    // Cargar datos extra desde Firestore (como el estado de pago)
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPaymentStatus(docSnap.data().paymentStatus || 'pending');
                    // Sincronizar nombre si en BD es diferente (opcional)
                    if (docSnap.data().displayName) setDisplayName(docSnap.data().displayName);
                } else {
                    setPaymentStatus('pending');
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
            }
        };
        fetchUserData();
    }, [user]);

    const handleSave = async () => {
        if (!displayName.trim()) return alert("El nombre no puede estar vacío");
        setSaving(true);
        try {
            // 1. Actualizar en Auth de Firebase (lo que usa la app para sesión)
            await updateProfile(user, { displayName });
            
            // 2. Actualizar en Firestore (para que el Admin lo vea)
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { displayName });

            setIsEditing(false);
            alert("Perfil actualizado correctamente.");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al actualizar tu perfil.");
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'US';

    return (
        <DashboardLayout isAdmin={false}>
            <div className="max-w-2xl mx-auto mt-10 p-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
                    
                    {/* Banner Decorativo */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
                        {/* Status Badge flotante */}
                        <div className="absolute top-4 right-4">
                             {paymentStatus === 'paid' ? (
                                <span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                    <i className="fas fa-check-circle"></i> PREMIUM / PAGADO
                                </span>
                             ) : (
                                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                    <i className="fas fa-clock"></i> PAGO PENDIENTE
                                </span>
                             )}
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -top-12 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500">
                                    {getInitials(displayName)}
                                </div>
                            </div>
                        </div>
                        
                        {/* Formulario de Edición */}
                        <div className="text-center mt-[-30px]">
                            {isEditing ? (
                                <div className="flex flex-col items-center gap-3 mt-4 animate-fade-in">
                                    <input 
                                        type="text" 
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="text-center text-xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none px-2 py-1 w-full max-w-xs bg-gray-50"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-1 text-sm text-gray-500 hover:text-gray-700 font-medium"
                                            disabled={saving}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                                        >
                                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative inline-block">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                                        {displayName}
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all text-sm"
                                            title="Editar nombre"
                                        >
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                    </h2>
                                    <p className="text-gray-500">{user?.email}</p>
                                </div>
                            )}
                        </div>

                        {/* Datos Informativos */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Información de Cuenta</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">UID (Soporte)</p>
                                    <p className="text-xs font-mono text-gray-600 mt-1 truncate px-2 select-all">{user?.uid}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Miembro Desde</p>
                                    <p className="text-sm font-bold text-gray-700 mt-1">
                                        {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Reciente'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserProfile;