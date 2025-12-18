import React from 'react';
import { auth } from '../../firebase/config';
import DashboardLayout from '../../components/DashboardLayout';

const UserProfile = () => {
    const user = auth.currentUser;

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'US';

    return (
        <DashboardLayout isAdmin={false}>
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -top-12 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                    {user?.photoURL ? <img src={user.photoURL} alt="" className="rounded-full" /> : getInitials(user?.displayName)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-[-30px]">
                            <h2 className="text-2xl font-bold text-gray-800">{user?.displayName || 'Usuario Turugol'}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                Jugador Activo
                            </span>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Estadísticas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide">Rol</p>
                                    <p className="text-lg font-bold text-gray-800">Usuario</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide">ID</p>
                                    <p className="text-xs font-mono text-gray-600 mt-1 truncate px-4">{user?.uid}</p>
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