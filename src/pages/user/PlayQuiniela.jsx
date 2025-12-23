import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'; 

const PlayQuiniela = () => {
    const { quinielaId } = useParams();
    const navigate = useNavigate();
    const [quiniela, setQuiniela] = useState(null);
    const [predictions, setPredictions] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuinielaAndValidate = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                // 1. Cargar datos
                const docRef = doc(db, 'quinielas', quinielaId);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    alert("Quiniela no encontrada");
                    navigate('/dashboard/user/available-quinielas');
                    return;
                }

                const qData = { id: docSnap.id, ...docSnap.data() };

                // 2. VALIDACIÓN DE FECHA
                const now = new Date();
                const deadline = new Date(qData.metadata.deadline);
                
                if (now > deadline) {
                    alert("⚠️ Esta quiniela ya cerró. No se aceptan más pronósticos.");
                    navigate('/dashboard/user/available-quinielas');
                    return;
                }

                // 3. VALIDACIÓN DE PARTICIPACIÓN PREVIA
                const participationQuery = query(
                    collection(db, 'userEntries'),
                    where('userId', '==', user.uid),
                    where('quinielaId', '==', quinielaId)
                );
                
                const participationSnap = await getDocs(participationQuery);

                if (!participationSnap.empty) {
                    alert("🚫 Ya has participado en esta quiniela. Puedes ver tu pronóstico en el historial.");
                    navigate('/dashboard/user/history');
                    return;
                }

                setQuiniela(qData);

            } catch (error) {
                console.error("Error de validación:", error);
                alert("Ocurrió un error al cargar la quiniela.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuinielaAndValidate();
    }, [quinielaId, navigate]);

    const handleSelect = (fixtureId, selection) => {
        setPredictions(prev => ({
            ...prev,
            [fixtureId]: selection
        }));
    };

    const handleSubmit = async () => {
        if (!quiniela) return;

        if (Object.keys(predictions).length !== quiniela.fixtures.length) {
            alert("Por favor realiza un pronóstico para todos los partidos.");
            return;
        }

        const now = new Date();
        const deadline = new Date(quiniela.metadata.deadline);
        if (now > deadline) {
            alert("❌ ¡Tiempo agotado! La quiniela cerró mientras llenabas tus datos.");
            navigate('/dashboard/user/available-quinielas');
            return;
        }

        setSubmitting(true);
        try {
            const entryId = `${auth.currentUser.uid}_${quiniela.id}`;

            await setDoc(doc(db, 'userEntries', entryId), {
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
            
            alert("✅ ¡Pronóstico enviado con éxito! Buena suerte.");
            navigate('/dashboard/user/history');
            
        } catch (error) {
            console.error("Error al enviar:", error);
            alert(`Error al guardar: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-blue-500"></i>
            <p>Verificando disponibilidad...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            
            {/* Header Informativo */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">{quiniela.metadata.title}</h2>
                <div className="flex justify-center items-center gap-2 mt-2 text-sm">
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold border border-red-100">
                        <i className="fas fa-clock mr-1"></i>
                        Cierra: {new Date(quiniela.metadata.deadline).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Lista de Partidos */}
            <div className="space-y-4">
                {quiniela.fixtures.map((fixture) => (
                    <div key={fixture.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                            <span>{fixture.leagueName}</span>
                            <span>{new Date(fixture.matchDate).toLocaleDateString()} {new Date(fixture.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Equipos */}
                            <div className="flex items-center justify-between w-full md:w-5/12 px-2">
                                <div className="flex flex-col items-center w-24">
                                    <img src={fixture.homeLogo} alt="Local" className="w-12 h-12 object-contain mb-2 drop-shadow-sm" />
                                    <span className="font-bold text-sm text-center leading-tight text-gray-800">{fixture.homeTeam}</span>
                                </div>
                                <span className="font-black text-gray-200 text-xl">VS</span>
                                <div className="flex flex-col items-center w-24">
                                    <img src={fixture.awayLogo} alt="Visita" className="w-12 h-12 object-contain mb-2 drop-shadow-sm" />
                                    <span className="font-bold text-sm text-center leading-tight text-gray-800">{fixture.awayTeam}</span>
                                </div>
                            </div>

                            {/* Botones de Selección */}
                            <div className="flex w-full md:w-7/12 gap-2 bg-gray-50 p-1.5 rounded-xl">
                                <button 
                                    onClick={() => handleSelect(fixture.id, 'HOME')}
                                    className={`flex-1 py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 border ${
                                        predictions[fixture.id] === 'HOME' 
                                        ? 'bg-white text-blue-600 border-blue-200 shadow-sm ring-2 ring-blue-500/20' 
                                        : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:text-gray-700'
                                    }`}
                                >
                                    LOCAL
                                </button>
                                <button 
                                    onClick={() => handleSelect(fixture.id, 'DRAW')}
                                    className={`flex-1 py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 border ${
                                        predictions[fixture.id] === 'DRAW' 
                                        ? 'bg-white text-gray-800 border-gray-300 shadow-sm ring-2 ring-gray-500/20' 
                                        : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:text-gray-700'
                                    }`}
                                >
                                    EMPATE
                                </button>
                                <button 
                                    onClick={() => handleSelect(fixture.id, 'AWAY')}
                                    className={`flex-1 py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 border ${
                                        predictions[fixture.id] === 'AWAY' 
                                        ? 'bg-white text-blue-600 border-blue-200 shadow-sm ring-2 ring-blue-500/20' 
                                        : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:text-gray-700'
                                    }`}
                                >
                                    VISITA
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Fijo para Enviar */}
            <div className="sticky bottom-6 mt-8 z-10 px-2">
                <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                    {submitting ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i> Guardando...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane"></i> 
                            Confirmar Pronósticos ({Object.keys(predictions).length}/{quiniela.fixtures.length})
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PlayQuiniela;