import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import DashboardLayout from '../../components/DashboardLayout';

const PlayQuiniela = () => {
    const { quinielaId } = useParams();
    const navigate = useNavigate();
    const [quiniela, setQuiniela] = useState(null);
    const [predictions, setPredictions] = useState({}); // { fixtureId: 'HOME' | 'DRAW' | 'AWAY' }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiniela = async () => {
            try {
                const docRef = doc(db, 'quinielas', quinielaId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setQuiniela({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert("Quiniela no encontrada");
                    navigate('/dashboard/user/available-quinielas');
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiniela();
    }, [quinielaId, navigate]);

    const handleSelect = (fixtureId, selection) => {
        setPredictions(prev => ({
            ...prev,
            [fixtureId]: selection
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(predictions).length !== quiniela.fixtures.length) {
            alert("Por favor realiza un pronóstico para todos los partidos.");
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'participaciones'), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                userName: auth.currentUser.displayName || 'Usuario',
                quinielaId: quiniela.id,
                quinielaName: quiniela.metadata.title,
                predictions: predictions,
                submittedAt: new Date().toISOString(),
                status: 'active',
                puntos: 0
            });
            alert("¡Pronóstico enviado con éxito! Buena suerte.");
            navigate('/dashboard/user/history');
        } catch (error) {
            console.error("Error al enviar:", error);
            alert("Error al guardar tu quiniela.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;

    return (
        <DashboardLayout isAdmin={false}>
            <div className="max-w-4xl mx-auto pb-10">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{quiniela.metadata.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">Selecciona tu pronóstico para cada partido.</p>
                </div>

                {/* Lista de Partidos */}
                <div className="space-y-4">
                    {quiniela.fixtures.map((fixture) => (
                        <div key={fixture.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                                <span>{fixture.leagueName}</span>
                                <span>{new Date(fixture.matchDate).toLocaleString()}</span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Equipos */}
                                <div className="flex items-center justify-between w-full md:w-5/12 px-4">
                                    <div className="flex flex-col items-center w-24">
                                        <img src={fixture.homeLogo} alt="Local" className="w-10 h-10 object-contain mb-2" />
                                        <span className="font-bold text-sm text-center leading-tight">{fixture.homeTeam}</span>
                                    </div>
                                    <span className="font-bold text-gray-300">VS</span>
                                    <div className="flex flex-col items-center w-24">
                                        <img src={fixture.awayLogo} alt="Visita" className="w-10 h-10 object-contain mb-2" />
                                        <span className="font-bold text-sm text-center leading-tight">{fixture.awayTeam}</span>
                                    </div>
                                </div>

                                {/* Botones de Selección */}
                                <div className="flex w-full md:w-7/12 gap-2">
                                    <button 
                                        onClick={() => handleSelect(fixture.id, 'HOME')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${predictions[fixture.id] === 'HOME' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        LOCAL
                                    </button>
                                    <button 
                                        onClick={() => handleSelect(fixture.id, 'DRAW')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${predictions[fixture.id] === 'DRAW' ? 'bg-gray-800 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        EMPATE
                                    </button>
                                    <button 
                                        onClick={() => handleSelect(fixture.id, 'AWAY')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${predictions[fixture.id] === 'AWAY' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        VISITA
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Fijo para Enviar */}
                <div className="sticky bottom-4 mt-8">
                    <button 
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Enviando...' : `Confirmar Pronósticos (${Object.keys(predictions).length}/${quiniela.fixtures.length})`}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PlayQuiniela;