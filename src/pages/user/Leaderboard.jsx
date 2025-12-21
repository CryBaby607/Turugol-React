import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import DashboardLayout from '../../components/DashboardLayout';

const Leaderboard = () => {
    const { quinielaId } = useParams();
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [quinielaInfo, setQuinielaInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Obtener info básica de la quiniela (Título)
                const quinielaRef = doc(db, 'quinielas', quinielaId);
                const quinielaSnap = await getDoc(quinielaRef);
                if (quinielaSnap.exists()) {
                    setQuinielaInfo(quinielaSnap.data());
                }

                // 2. Obtener todas las participaciones de esta quiniela
                const q = query(
                    collection(db, 'participaciones'), 
                    where('quinielaId', '==', quinielaId)
                );
                const snapshot = await getDocs(q);
                
                const participants = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // 3. Ordenar por Puntos (Descendente)
                // Si hay empate en puntos, podrías agregar lógica secundaria (ej. fecha de envío)
                const sorted = participants.sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
                
                setLeaders(sorted);

            } catch (error) {
                console.error("Error al cargar leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [quinielaId]);

    // Helper para iconos de medallas
    const getRankIcon = (index) => {
        if (index === 0) return <span className="text-2xl">🥇</span>;
        if (index === 1) return <span className="text-2xl">🥈</span>;
        if (index === 2) return <span className="text-2xl">🥉</span>;
        return <span className="font-bold text-gray-500">#{index + 1}</span>;
    };

    return (
        <DashboardLayout isAdmin={false}>
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                
                {/* Header con botón de regreso */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Tabla de Posiciones</h2>
                        {quinielaInfo && <p className="text-gray-500 text-sm">{quinielaInfo.metadata?.title}</p>}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">
                        <i className="fas fa-circle-notch fa-spin text-3xl mb-3"></i>
                        <p>Calculando posiciones...</p>
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="p-8 bg-white rounded-xl border border-dashed text-center text-gray-500">
                        Nadie ha participado en esta quiniela aún.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-center w-20 text-xs font-bold text-gray-400 uppercase">Rank</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Usuario</th>
                                    <th className="p-4 text-right text-xs font-bold text-gray-400 uppercase">Puntos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaders.map((leader, index) => {
                                    const isMe = leader.userId === currentUser?.uid;
                                    return (
                                        <tr 
                                            key={leader.id} 
                                            className={`
                                                transition-colors 
                                                ${isMe ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}
                                            `}
                                        >
                                            <td className="p-4 text-center">
                                                {getRankIcon(index)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar Generado por Iniciales */}
                                                    <div className={`
                                                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                                        ${isMe ? 'bg-blue-600' : 'bg-gray-400'}
                                                    `}>
                                                        {leader.userName?.substring(0, 2).toUpperCase() || '??'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`font-bold text-sm ${isMe ? 'text-blue-700' : 'text-gray-700'}`}>
                                                            {leader.userName} {isMe && '(Tú)'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(leader.submittedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="font-black text-lg text-gray-800">{leader.puntos || 0}</span>
                                                <span className="text-xs text-gray-400 ml-1">pts</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Leaderboard;