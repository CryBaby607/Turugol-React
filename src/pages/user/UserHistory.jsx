import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import DashboardLayout from '../../components/DashboardLayout';

const UserHistory = () => {
    const [participaciones, setParticipaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const q = query(
                    collection(db, 'participaciones'), 
                    where('userId', '==', user.uid),
                    orderBy('submittedAt', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setParticipaciones(data);
            } catch (error) {
                console.error("Error cargando historial:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <DashboardLayout isAdmin={false}>
            <div className="max-w-5xl mx-auto p-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Mis Pronósticos</h2>

                {loading ? <p className="text-center text-gray-500">Cargando...</p> : participaciones.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                        <p className="text-gray-500">Aún no has participado en ninguna quiniela.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {participaciones.map((part) => (
                            <div key={part.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{part.quinielaName}</h3>
                                        <p className="text-xs text-gray-500">Jugado el: {new Date(part.submittedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${part.puntos > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {part.puntos ? `${part.puntos} Puntos` : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                                {/* Aquí podrías agregar un botón "Ver Detalle" para mostrar los picks específicos */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserHistory;