import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc, query, where, writeBatch } from 'firebase/firestore';
import { fetchFromApi } from '../../services/footballApi';

const ManageQuinielas = () => {
    const [quinielas, setQuinielas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiniela, setSelectedQuiniela] = useState(null);
    const [editingScores, setEditingScores] = useState({});
    
    // Estados de proceso
    const [isSyncing, setIsSyncing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const [activeTab, setActiveTab] = useState('active');

    // Cargar Quinielas
    useEffect(() => {
        const fetchQuinielas = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'quinielas'));
                const quinielasData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Ordenar: Las más nuevas primero
                setQuinielas(quinielasData.sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt)));
            } catch (error) {
                console.error("Error al cargar quinielas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuinielas();
    }, []);

    const handleOpenResults = (quiniela) => {
        setSelectedQuiniela(quiniela);
        const initialScores = {};
        if (quiniela.fixtures) {
            quiniela.fixtures.forEach(fixture => {
                if (fixture.result) {
                    initialScores[fixture.id] = { 
                        home: fixture.result.home, 
                        away: fixture.result.away 
                    };
                }
            });
        }
        setEditingScores(initialScores);
    };

    // Sincronizar con API
    const syncWithApi = async () => {
        if (!selectedQuiniela) return;
        setIsSyncing(true);
        try {
            const promises = selectedQuiniela.fixtures.map(async (fixture) => {
                // Pequeña pausa para no saturar la API si son muchos partidos (opcional)
                const data = await fetchFromApi('fixtures', `?id=${fixture.id}&timezone=America/Mexico_City`);
                return data.response[0]; 
            });
            
            const results = await Promise.all(promises);
            const newScores = { ...editingScores };
            let updatesCount = 0;

            results.forEach(match => {
                // Solo actualizamos si el partido terminó o está en penales/tiempo extra
                if (match && ['FT', 'AET', 'PEN'].includes(match.fixture.status.short)) {
                    newScores[match.fixture.id] = { home: match.goals.home, away: match.goals.away };
                    updatesCount++;
                }
            });
            setEditingScores(newScores);
            alert(`Sincronización completada. Se encontraron resultados para ${updatesCount} partidos.`);
        } catch (error) {
            console.error("Error API:", error);
            alert("Error al conectar con la API.");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleScoreChange = (fixtureId, team, value) => {
        setEditingScores(prev => ({
            ...prev,
            [fixtureId]: { ...prev[fixtureId], [team]: value }
        }));
    };

    // --- LOGICA DE RESOLUCIÓN DE PUNTOS ---
    const determineOutcome = (homeScore, awayScore) => {
        const h = parseInt(homeScore);
        const a = parseInt(awayScore);
        if (isNaN(h) || isNaN(a)) return null; // Partido no jugado o error
        if (h > a) return 'HOME';
        if (a > h) return 'AWAY';
        return 'DRAW';
    };

    const saveResultsAndCalculate = async () => {
        if (!selectedQuiniela) return;
        if (!window.confirm("¿Estás seguro? Esto calculará los puntos de TODOS los usuarios y no se puede deshacer fácilmente.")) return;

        setIsProcessing(true);
        setStatusMessage("Guardando resultados del partido...");

        try {
            // 1. Guardar resultados en la colección 'quinielas'
            const quinielaRef = doc(db, 'quinielas', selectedQuiniela.id);
            
            // Creamos un mapa de resultados oficiales para usarlo en el cálculo rápido
            const officialOutcomes = {}; // { fixtureId: 'HOME' | 'AWAY' | 'DRAW' }

            const updatedFixtures = selectedQuiniela.fixtures.map(fixture => {
                const newScore = editingScores[fixture.id];
                if (newScore && newScore.home !== undefined && newScore.away !== undefined) {
                    const outcome = determineOutcome(newScore.home, newScore.away);
                    if (outcome) officialOutcomes[fixture.id] = outcome;
                    
                    return { 
                        ...fixture, 
                        result: { home: parseInt(newScore.home), away: parseInt(newScore.away) },
                        outcome: outcome 
                    };
                }
                return fixture;
            });

            // Actualizamos la Quiniela Maestra
            await updateDoc(quinielaRef, { 
                fixtures: updatedFixtures,
                status: 'closed' // Opcional: Marcarla como cerrada/calificada
            });

            // 2. Calcular Puntos de Usuarios
            setStatusMessage("Obteniendo participaciones...");
            // CORRECCIÓN: Usar 'userEntries' en lugar de 'participaciones'
            const q = query(collection(db, 'userEntries'), where('quinielaId', '==', selectedQuiniela.id));
            const participationsSnapshot = await getDocs(q);

            if (participationsSnapshot.empty) {
                alert("Resultados guardados. No hubo participantes para calcular.");
                window.location.reload();
                return;
            }

            setStatusMessage(`Calculando puntos de ${participationsSnapshot.size} usuarios...`);

            // Procesamiento por Lotes (Firestore Batch limit is 500 operations)
            const BATCH_SIZE = 400;
            let batch = writeBatch(db);
            let operationCounter = 0;
            let totalProcessed = 0;

            for (const participationDoc of participationsSnapshot.docs) {
                const data = participationDoc.data();
                let userPoints = 0;

                // Comparamos predicciones contra resultados oficiales
                if (data.predictions) {
                    Object.keys(data.predictions).forEach(fixtureId => {
                        const userPick = data.predictions[fixtureId]; // 'HOME', 'DRAW', 'AWAY'
                        const actualOutcome = officialOutcomes[fixtureId];

                        if (userPick && actualOutcome && userPick === actualOutcome) {
                            userPoints += 1; // +1 punto por acierto
                        }
                    });
                }

                // Preparamos la actualización
                // CORRECCIÓN: Usar 'userEntries' en lugar de 'participaciones'
                const participationRef = doc(db, 'userEntries', participationDoc.id);
                batch.update(participationRef, { 
                    puntos: userPoints,
                    status: 'finalized', // Marcamos como finalizada
                    calculatedAt: new Date().toISOString()
                });

                operationCounter++;
                totalProcessed++;

                // Si llenamos el batch, lo ejecutamos y creamos uno nuevo
                if (operationCounter >= BATCH_SIZE) {
                    await batch.commit();
                    batch = writeBatch(db);
                    operationCounter = 0;
                    setStatusMessage(`Procesados ${totalProcessed} usuarios...`);
                }
            }

            // Ejecutar las operaciones restantes
            if (operationCounter > 0) {
                await batch.commit();
            }

            alert(`¡Éxito! Quiniela actualizada y puntos calculados para ${totalProcessed} usuarios.`);
            setSelectedQuiniela(null);
            window.location.reload();

        } catch (error) {
            console.error("Error crítico al guardar/calcular:", error);
            alert("Ocurrió un error al guardar. Revisa la consola.");
        } finally {
            setIsProcessing(false);
            setStatusMessage('');
        }
    };

    // Filtros de Pestañas
    const now = new Date();
    const activeQuinielas = quinielas.filter(q => new Date(q.metadata.deadline) > now);
    const historyQuinielas = quinielas.filter(q => new Date(q.metadata.deadline) <= now);
    const displayedQuinielas = activeTab === 'active' ? activeQuinielas : historyQuinielas;

    return (
        <DashboardLayout isAdmin={true}>
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Gestionar Quinielas</h2>
                    
                    {/* TABS SELECTOR */}
                    <div className="bg-gray-200 p-1 rounded-lg flex space-x-1 mt-4 md:mt-0">
                        <button 
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            En Juego ({activeQuinielas.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Historial ({historyQuinielas.length})
                        </button>
                    </div>
                </div>

                {loading ? <p className="text-center text-gray-500 py-10">Cargando...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedQuinielas.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                                <i className="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                                <p>No hay quinielas en esta sección.</p>
                            </div>
                        )}
                        {displayedQuinielas.map((q) => {
                            const isOpen = new Date() < new Date(q.metadata.deadline);
                            return (
                                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isOpen ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {isOpen ? 'ABIERTA' : 'CERRADA'}
                                            </span>
                                            <small className="text-gray-400 text-xs">ID: {q.id.substring(0,6)}</small>
                                        </div>
                                        
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate" title={q.metadata.title}>{q.metadata.title}</h3>
                                        
                                        <div className="space-y-2 text-sm text-gray-600 mb-5">
                                            <div className="flex items-center">
                                                <i className="fas fa-calendar-alt w-5 text-gray-400"></i>
                                                <span>Cierre: {new Date(q.metadata.deadline).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="fas fa-futbol w-5 text-gray-400"></i>
                                                <span>{q.fixtures?.length || 0} Partidos</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleOpenResults(q)}
                                            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white group-hover:border-blue-600"
                                        >
                                            {isOpen ? 'Editar Detalles' : 'Ingresar Resultados'}
                                        </button>
                                    </div>
                                    <div className={`h-1 w-full ${isOpen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MODAL DE RESULTADOS */}
                {selectedQuiniela && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl animate-fade-in">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Resultados & Cálculo</h3>
                                    <p className="text-sm text-gray-500">{selectedQuiniela.metadata.title}</p>
                                </div>
                                <button onClick={() => !isProcessing && setSelectedQuiniela(null)} disabled={isProcessing} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            {/* Barra de Progreso / Status */}
                            {isProcessing && (
                                <div className="mb-6 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl flex items-center animate-pulse">
                                    <i className="fas fa-cog fa-spin mr-3 text-xl"></i>
                                    <span className="font-bold">{statusMessage}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <div className="text-sm text-indigo-800">
                                    <p className="font-bold">Automátizacion</p>
                                    <p>Trae los marcadores finales directamente desde la API.</p>
                                </div>
                                <button 
                                    onClick={syncWithApi}
                                    disabled={isSyncing || isProcessing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
                                >
                                    {isSyncing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                                    Sincronizar
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 mb-6 custom-scrollbar">
                                {selectedQuiniela.fixtures.map((fixture) => (
                                    <div key={fixture.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 w-1/3">
                                            <span className="text-sm font-semibold text-right w-full truncate text-gray-700">{fixture.homeTeam}</span>
                                            <img src={fixture.homeLogo} alt="" className="w-8 h-8 object-contain" />
                                        </div>
                                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                                            <input type="number" className="w-10 h-8 text-center font-bold text-lg outline-none appearance-none"
                                                value={editingScores[fixture.id]?.home ?? ''}
                                                onChange={(e) => handleScoreChange(fixture.id, 'home', e.target.value)}
                                                placeholder="-"
                                                disabled={isProcessing}
                                            />
                                            <span className="text-gray-300">:</span>
                                            <input type="number" className="w-10 h-8 text-center font-bold text-lg outline-none appearance-none"
                                                value={editingScores[fixture.id]?.away ?? ''}
                                                onChange={(e) => handleScoreChange(fixture.id, 'away', e.target.value)}
                                                placeholder="-"
                                                disabled={isProcessing}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 w-1/3 justify-end">
                                            <img src={fixture.awayLogo} alt="" className="w-8 h-8 object-contain" />
                                            <span className="text-sm font-semibold text-left w-full truncate text-gray-700">{fixture.awayTeam}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => setSelectedQuiniela(null)} 
                                    disabled={isProcessing}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={saveResultsAndCalculate} 
                                    disabled={isProcessing}
                                    className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    {isProcessing ? 'Procesando...' : 'Guardar y Calcular Puntos'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageQuinielas;