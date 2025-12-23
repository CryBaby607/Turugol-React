import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';

const PlayQuiniela = () => {
    const { quinielaId } = useParams();
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [quiniela, setQuiniela] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Estado para guardar los pronósticos: { fixtureId: 'HOME' | 'DRAW' | 'AWAY' }
    const [predictions, setPredictions] = useState({});
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);

    useEffect(() => {
        const fetchQuinielaAndCheckEntry = async () => {
            try {
                // 1. Cargar datos de la quiniela
                const docRef = doc(db, 'quinielas', quinielaId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setQuiniela({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert("Quiniela no encontrada");
                    navigate('/dashboard/user');
                    return;
                }

                // 2. Verificar si el usuario ya jugó esta quiniela
                if (user) {
                    const q = query(
                        collection(db, 'userEntries'),
                        where('userId', '==', user.uid),
                        where('quinielaId', '==', quinielaId)
                    );
                    const entrySnap = await getDocs(q);
                    if (!entrySnap.empty) {
                        setAlreadyPlayed(true);
                    }
                }

            } catch (error) {
                console.error("Error al cargar:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && quinielaId) {
            fetchQuinielaAndCheckEntry();
        }
    }, [quinielaId, user, navigate]);

    // Manejar la selección del pronóstico (1 X 2)
    const handleSelect = (fixtureId, selection) => {
        setPredictions(prev => ({
            ...prev,
            [fixtureId]: selection
        }));
    };

    const handleSubmit = async () => {
        if (!user) return;
        
        // Validar que todos los partidos tengan pronóstico
        const totalFixtures = quiniela?.fixtures?.length || 0;
        const predictedCount = Object.keys(predictions).length;

        if (predictedCount < totalFixtures) {
            alert(`Faltan partidos por pronosticar. Llevas ${predictedCount} de ${totalFixtures}.`);
            return;
        }

        setSubmitting(true);

        try {
            // Guardar la entrada en Firebase
            await addDoc(collection(db, 'userEntries'), {
                userId: user.uid,
                userName: user.displayName || 'Usuario', // Guardamos nombre para facilitar lectura en Admin
                email: user.email,
                quinielaId: quinielaId,
                quinielaName: quiniela.metadata.title, // Copia del título para historial
                predictions: predictions,
                createdAt: new Date().toISOString(),
                status: 'active', // Estado de la jugada (active/finalized)
                puntos: 0,
                
                // 👇 CAMBIO CRÍTICO: Estado de Pago Inicial 👇
                paymentStatus: 'pending' 
            });

            alert("¡Pronósticos enviados con éxito! Tu participación está pendiente de pago.");
            navigate('/dashboard/user/history'); // Redirigir al historial

        } catch (error) {
            console.error("Error al enviar pronósticos:", error);
            alert("Hubo un error al guardar tu quiniela.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando quiniela...</div>;

    if (alreadyPlayed) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
                <div className="text-green-500 text-5xl mb-4"><i className="fas fa-check-circle"></i></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Ya estás participando!</h2>
                <p className="text-gray-500 mb-6">Ya has enviado tus pronósticos para esta quiniela.</p>
                <button 
                    onClick={() => navigate('/dashboard/user/history')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    Ver mi Historial
                </button>
            </div>
        );
    }

    // Verificar si la quiniela ya cerró
    const isClosed = new Date() > new Date(quiniela?.metadata?.deadline);

    if (isClosed) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center bg-red-50 rounded-2xl border border-red-100 mt-10">
                <div className="text-red-500 text-5xl mb-4"><i className="fas fa-clock"></i></div>
                <h2 className="text-2xl font-bold text-red-800 mb-2">Quiniela Cerrada</h2>
                <p className="text-red-600">El tiempo límite para participar ha terminado.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
            
            {/* Header del Evento */}
            <div className="mb-8 text-center">
                <span className="text-blue-600 font-bold tracking-wider text-xs uppercase mb-2 block">Nueva Participación</span>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{quiniela.metadata.title}</h1>
                <p className="text-gray-500 text-sm">
                    <i className="far fa-clock mr-1"></i> Cierra el: {new Date(quiniela.metadata.deadline).toLocaleDateString()} a las {new Date(quiniela.metadata.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
            </div>

            {/* Lista de Partidos */}
            <div className="space-y-4 mb-8">
                {quiniela.fixtures.map((fixture) => {
                    const pick = predictions[fixture.id]; // 'HOME', 'DRAW', 'AWAY'
                    
                    return (
                        <div key={fixture.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                
                                {/* Equipo Local */}
                                <div className="flex items-center gap-3 w-full md:w-1/3 justify-start md:justify-end">
                                    <span className="font-bold text-gray-700 text-right w-full">{fixture.homeTeam}</span>
                                    <img src={fixture.homeLogo} alt="" className="w-10 h-10 object-contain" />
                                </div>

                                {/* Selección 1X2 */}
                                <div className="flex gap-2 w-full md:w-auto justify-center">
                                    {/* Botón LOCAL */}
                                    <button 
                                        onClick={() => handleSelect(fixture.id, 'HOME')}
                                        className={`w-12 h-10 rounded-lg font-bold text-sm transition-all border ${
                                            pick === 'HOME' 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        L
                                    </button>

                                    {/* Botón EMPATE */}
                                    <button 
                                        onClick={() => handleSelect(fixture.id, 'DRAW')}
                                        className={`w-12 h-10 rounded-lg font-bold text-sm transition-all border ${
                                            pick === 'DRAW' 
                                            ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105' 
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        E
                                    </button>

                                    {/* Botón VISITANTE */}
                                    <button 
                                        onClick={() => handleSelect(fixture.id, 'AWAY')}
                                        className={`w-12 h-10 rounded-lg font-bold text-sm transition-all border ${
                                            pick === 'AWAY' 
                                            ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' 
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        V
                                    </button>
                                </div>

                                {/* Equipo Visitante */}
                                <div className="flex items-center gap-3 w-full md:w-1/3">
                                    <img src={fixture.awayLogo} alt="" className="w-10 h-10 object-contain" />
                                    <span className="font-bold text-gray-700 text-left w-full">{fixture.awayTeam}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Botón de Envío */}
            <div className="sticky bottom-4 z-10">
                <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-70 disabled:scale-100"
                >
                    {submitting ? (
                        <span><i className="fas fa-spinner fa-spin mr-2"></i> Enviando...</span>
                    ) : (
                        <span>Enviar Quiniela <i className="fas fa-paper-plane ml-2"></i></span>
                    )}
                </button>
            </div>

        </div>
    );
};

export default PlayQuiniela;