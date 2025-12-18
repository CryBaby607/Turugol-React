import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { fetchFromApi } from '../../services/footballApi';

const ManageQuinielas = () => {
    const [quinielas, setQuinielas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiniela, setSelectedQuiniela] = useState(null);
    const [editingScores, setEditingScores] = useState({});
    const [isSyncing, setIsSyncing] = useState(false);
    
    // Estado para las pestañas
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

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
        quiniela.fixtures.forEach(fixture => {
            if (fixture.result) {
                initialScores[fixture.id] = { 
                    home: fixture.result.home, 
                    away: fixture.result.away 
                };
            }
        });
        setEditingScores(initialScores);
    };

    const syncWithApi = async () => {
        if (!selectedQuiniela) return;
        setIsSyncing(true);
        try {
            const promises = selectedQuiniela.fixtures.map(async (fixture) => {
                const data = await fetchFromApi('fixtures', `?id=${fixture.id}&timezone=America/Mexico_City`);
                return data.response[0]; 
            });
            const results = await Promise.all(promises);
            const newScores = { ...editingScores };
            let updatesCount = 0;
            results.forEach(match => {
                if (match && ['FT', 'AET', 'PEN'].includes(match.fixture.status.short)) {
                    newScores[match.fixture.id] = { home: match.goals.home, away: match.goals.away };
                    updatesCount++;
                }
            });
            setEditingScores(newScores);
            alert(`Sincronización completada. Se actualizaron ${updatesCount} partidos.`);
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

    const saveResults = async () => {
        if (!selectedQuiniela) return;
        try {
            const quinielaRef = doc(db, 'quinielas', selectedQuiniela.id);
            const updatedFixtures = selectedQuiniela.fixtures.map(fixture => {
                const newScore = editingScores[fixture.id];
                return newScore ? { ...fixture, result: { home: parseInt(newScore.home), away: parseInt(newScore.away) } } : fixture;
            });
            await updateDoc(quinielaRef, { fixtures: updatedFixtures });
            alert('¡Resultados guardados!');
            setSelectedQuiniela(null);
            // Recargar simple para actualizar la vista
            window.location.reload(); 
        } catch (error) {
            console.error("Error al guardar:", error);
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
                                    {/* Barra decorativa inferior */}
                                    <div className={`h-1 w-full ${isOpen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MODAL DE RESULTADOS (Mismo diseño funcional, mejorado visualmente) */}
                {selectedQuiniela && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl animate-fade-in">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Resultados</h3>
                                    <p className="text-sm text-gray-500">{selectedQuiniela.metadata.title}</p>
                                </div>
                                <button onClick={() => setSelectedQuiniela(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <div className="text-sm text-indigo-800">
                                    <p className="font-bold">Automátizacion</p>
                                    <p>Trae los marcadores finales directamente desde la API.</p>
                                </div>
                                <button 
                                    onClick={syncWithApi}
                                    disabled={isSyncing}
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
                                            />
                                            <span className="text-gray-300">:</span>
                                            <input type="number" className="w-10 h-8 text-center font-bold text-lg outline-none appearance-none"
                                                value={editingScores[fixture.id]?.away ?? ''}
                                                onChange={(e) => handleScoreChange(fixture.id, 'away', e.target.value)}
                                                placeholder="-"
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
                                <button onClick={() => setSelectedQuiniela(null)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancelar</button>
                                <button onClick={saveResults} className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all transform active:scale-95">Guardar Resultados</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageQuinielas;