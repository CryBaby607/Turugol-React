import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// 1. CAMBIO: URL DIRECTA Y HEADERS
const API_BASE_URL = 'https://v3.football.api-sports.io/fixtures'; 
const API_HEADERS = {
    'x-rapidapi-key': import.meta.env.VITE_API_FOOTBALL_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
};

const ManageQuinielas = () => {
    const [quinielas, setQuinielas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiniela, setSelectedQuiniela] = useState(null);
    const [editingScores, setEditingScores] = useState({});
    
    // Estado para feedback visual de la sincronización
    const [isSyncing, setIsSyncing] = useState(false);

    // 1. Cargar todas las quinielas (Sin cambios)
    const fetchQuinielas = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'quinielas'));
            const quinielasData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuinielas(quinielasData.sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt)));
        } catch (error) {
            console.error("Error al cargar quinielas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuinielas();
    }, []);

    // 2. Manejar apertura del modal (Sin cambios)
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

    // 3. ACTUALIZADO: Sincronizar con la API usando HEADERS
    const syncWithApi = async () => {
        if (!selectedQuiniela) return;
        setIsSyncing(true);
        
        try {
            const promises = selectedQuiniela.fixtures.map(async (fixture) => {
                // CAMBIO: URL completa y headers
                const response = await fetch(`${API_BASE_URL}?id=${fixture.id}&timezone=America/Mexico_City`, {
                    headers: API_HEADERS
                });
                const data = await response.json();
                return data.response[0]; 
            });

            const results = await Promise.all(promises);
            
            const newScores = { ...editingScores };
            let updatesCount = 0;

            results.forEach(match => {
                if (match && ['FT', 'AET', 'PEN'].includes(match.fixture.status.short)) {
                    newScores[match.fixture.id] = {
                        home: match.goals.home,
                        away: match.goals.away
                    };
                    updatesCount++;
                }
            });

            setEditingScores(newScores);
            alert(`Sincronización completada. Se actualizaron ${updatesCount} partidos.`);

        } catch (error) {
            console.error("Error al sincronizar con API:", error);
            alert("Error al conectar con la API de fútbol.");
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
            alert('¡Resultados guardados correctamente!');
            setSelectedQuiniela(null);
            fetchQuinielas();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar en base de datos.");
        }
    };

    const getStatusBadge = (deadline) => {
        const isOpen = new Date() < new Date(deadline);
        return <span className={`px-2 py-1 text-xs rounded-full font-bold ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isOpen ? 'ABIERTA' : 'CERRADA'}</span>;
    };

    return (
        <DashboardLayout isAdmin={true}>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestionar Quinielas</h2>

                {loading ? <p className="text-center text-gray-500">Cargando...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quinielas.map((q) => (
                            <div key={q.id} className="bg-white rounded-xl shadow border p-5 hover:shadow-lg transition">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-lg truncate" title={q.metadata.title}>{q.metadata.title}</h3>
                                    {getStatusBadge(q.metadata.deadline)}
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Partidos: {q.fixtures?.length || 0}</p>
                                <button onClick={() => handleOpenResults(q)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                                    <i className="fas fa-edit mr-2"></i> Administrar Resultados
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* MODAL DE RESULTADOS */}
                {selectedQuiniela && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="text-xl font-bold truncate">Resultados: {selectedQuiniela.metadata.title}</h3>
                                <button onClick={() => setSelectedQuiniela(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
                            </div>

                            {/* BARRA DE HERRAMIENTAS */}
                            <div className="flex justify-between items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Puedes ingresar resultados manuales o sincronizar.
                                </p>
                                <button 
                                    onClick={syncWithApi}
                                    disabled={isSyncing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center"
                                >
                                    {isSyncing ? (
                                        <><i className="fas fa-spinner fa-spin mr-2"></i> Buscando...</>
                                    ) : (
                                        <><i className="fas fa-cloud-download-alt mr-2"></i> Auto-llenar desde API</>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 mb-6">
                                {selectedQuiniela.fixtures.map((fixture) => (
                                    <div key={fixture.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                                        <div className="flex items-center gap-2 w-1/3">
                                            <span className="text-xs font-bold text-right w-full truncate">{fixture.homeTeam}</span>
                                            <img src={fixture.homeLogo} alt="" className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" className="w-12 h-10 text-center border rounded font-bold text-lg"
                                                value={editingScores[fixture.id]?.home ?? ''}
                                                onChange={(e) => handleScoreChange(fixture.id, 'home', e.target.value)}
                                            />
                                            <span className="font-bold">-</span>
                                            <input type="number" className="w-12 h-10 text-center border rounded font-bold text-lg"
                                                value={editingScores[fixture.id]?.away ?? ''}
                                                onChange={(e) => handleScoreChange(fixture.id, 'away', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-1/3 justify-end">
                                            <img src={fixture.awayLogo} alt="" className="w-6 h-6" />
                                            <span className="text-xs font-bold text-left w-full truncate">{fixture.awayTeam}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button onClick={() => setSelectedQuiniela(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button onClick={saveResults} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md">Guardar Resultados</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageQuinielas;