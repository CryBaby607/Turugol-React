import React, { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { db, auth } from '../../firebase/config'; 
import { doc, setDoc, getDoc, deleteDoc, collection } from 'firebase/firestore';
import { fetchFromApi } from '../../services/footballApi';

const QUINIELA_BORRADORES_COLLECTION = "quinielaBorradores";
const QUINIELAS_FINAL_COLLECTION = "quinielas";

const SEASON_YEAR = 2025; 
const MAX_FIXTURES = 9;
const MAX_DESCRIPTION_CHARS = 200;

const DUMMY_LEAGUES = [
    { id: 140, name: 'LaLiga (España)', nameShort: 'LALIGA' },
    { id: 39, name: 'Premier League (Inglaterra)', nameShort: 'PREMIER' },
    { id: 262, name: 'Liga MX (México)', nameShort: 'LIGA MX' },
];

const CreateQuiniela = () => {
    const user = auth.currentUser; 
    const currentAdminId = user ? user.uid : null; 

    // --- ESTADOS ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(''); 
    const [selectedLeagueId, setSelectedLeagueId] = useState(DUMMY_LEAGUES[0].id);
    const [selectedRound, setSelectedRound] = useState(''); 
    
    const [availableRounds, setAvailableRounds] = useState([]); 
    const [isLoadingRounds, setIsLoadingRounds] = useState(false);
    const [apiFixtures, setApiFixtures] = useState([]); 
    const [selectedFixtures, setSelectedFixtures] = useState([]); 
    
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isSaving, setIsSaving] = useState(false); 
    const [saveError, setSaveError] = useState(null); 
    const [deadlineError, setDeadlineError] = useState('');

    const initialLoadRef = useRef(true); 
    const isSubmittingRef = useRef(false);

    // --- FUNCIONES FIREBASE (Se mantienen igual) ---
    const getBorradorRef = (uid) => doc(db, QUINIELA_BORRADORES_COLLECTION, uid);

    const saveDraftToFirebase = async (data, uid) => {
        if (!uid) throw new Error("UID requerido");
        await setDoc(getBorradorRef(uid), data);
    };

    const loadDraftFromFirebase = async (uid) => {
        if (!uid) return null;
        const docSnap = await getDoc(getBorradorRef(uid));
        return docSnap.exists() ? docSnap.data() : null; 
    };

    const deleteDraftFromFirebase = async (uid) => {
        if (uid) await deleteDoc(getBorradorRef(uid));
    };

    const saveFinalQuiniela = async (payload) => {
        const quinielaRef = doc(collection(db, QUINIELAS_FINAL_COLLECTION));
        await setDoc(quinielaRef, payload);
        return quinielaRef.id;
    };

    // --- EFECTOS DE FECHA Y GUARDADO (Se mantienen igual) ---
    useEffect(() => {
        if (selectedFixtures.length > 0) {
            const earliestMatchTimestamp = Math.min(
                ...selectedFixtures.map(f => new Date(f.fixture.date).getTime())
            );
            const oneHourBefore = new Date(earliestMatchTimestamp - 3600000);
            const tzOffset = oneHourBefore.getTimezoneOffset() * 60000;
            const localISOTime = new Date(oneHourBefore.getTime() - tzOffset).toISOString().slice(0, 16);
            setDeadline(localISOTime);
            setDeadlineError(''); 
        }
    }, [selectedFixtures]);

    useEffect(() => {
        if (!currentAdminId) return; 
        const loadInitialDraft = async () => {
            try {
                const draft = await loadDraftFromFirebase(currentAdminId);
                if (draft) {
                    setTitle(draft.title || '');
                    setDescription(draft.description || '');
                    if (!draft.selectedFixtures?.length) setDeadline(draft.deadline || '');
                    setSelectedFixtures(draft.selectedFixtures || []);
                    setSelectedLeagueId(draft.selectedLeagueId || DUMMY_LEAGUES[0].id);
                    if (draft.selectedRound) setSelectedRound(draft.selectedRound);
                }
            } catch (error) {
                console.error(error);
            }
            initialLoadRef.current = false;
        };
        loadInitialDraft();
    }, [currentAdminId]); 

    useEffect(() => {
        if (initialLoadRef.current || !currentAdminId || isSubmittingRef.current) return; 
        setIsSaving(true);
        const timer = setTimeout(async () => {
            if (isSubmittingRef.current) return;
            if (title || selectedFixtures.length > 0) {
                try {
                    await saveDraftToFirebase({
                        title, description, deadline, selectedFixtures, selectedLeagueId, selectedRound
                    }, currentAdminId); 
                } catch (error) {
                    setSaveError("Error al autoguardar");
                }
            }
            setIsSaving(false);
        }, 1500); 
        return () => clearTimeout(timer); 
    }, [title, description, deadline, selectedFixtures, selectedLeagueId, selectedRound, currentAdminId]);

    // --- 3. CARGAR JORNADAS (USANDO SERVICIO) ---
    useEffect(() => {
        const fetchRoundsForLeague = async () => {
            if (!selectedLeagueId) return;
            setIsLoadingRounds(true);
            setAvailableRounds([]); 
            
            try {
                // Usamos el helper centralizado. Nota que el endpoint es 'fixtures/rounds'
                const allRoundsData = await fetchFromApi('fixtures/rounds', `?league=${selectedLeagueId}&season=${SEASON_YEAR}`);
                
                if (allRoundsData.response) {
                    setAvailableRounds(allRoundsData.response);
                }

                // Obtener jornada actual
                const currentRoundData = await fetchFromApi('fixtures/rounds', `?league=${selectedLeagueId}&season=${SEASON_YEAR}&current=true`);

                if (currentRoundData.response && currentRoundData.response.length > 0) {
                    setSelectedRound(currentRoundData.response[0]);
                } else if (allRoundsData.response && allRoundsData.response.length > 0) {
                    setSelectedRound(allRoundsData.response[allRoundsData.response.length - 1]);
                }

            } catch (error) {
                console.error("Error al cargar rondas:", error);
                setApiError("Error al cargar las jornadas de la liga.");
            } finally {
                setIsLoadingRounds(false);
            }
        };

        if (!initialLoadRef.current) {
            fetchRoundsForLeague();
        }
    }, [selectedLeagueId]);

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') setTitle(value);
        if (name === 'description') {
            if (value.length <= MAX_DESCRIPTION_CHARS) setDescription(value);
        }
        if (name === 'deadline') setDeadline(value);
    };

    const handleLeagueChange = (e) => {
        const newLeagueId = parseInt(e.target.value);
        if (newLeagueId !== selectedLeagueId) {
            setSelectedLeagueId(newLeagueId);
            setSelectedRound('');
            setApiFixtures([]); 
        }
    };
    
    const handleRoundChange = (e) => {
        setSelectedRound(e.target.value);
        setApiFixtures([]); 
    };

    const toggleFixtureSelection = (fixtureData) => {
        setSelectedFixtures(prev => {
            const isSelected = prev.some(f => f.fixture.id === fixtureData.fixture.id);
            if (isSelected) {
                return prev.filter(f => f.fixture.id !== fixtureData.fixture.id);
            } else if (prev.length < MAX_FIXTURES) {
                const league = DUMMY_LEAGUES.find(l => l.id === selectedLeagueId);
                return [...prev, { 
                    ...fixtureData, 
                    league: { 
                        id: selectedLeagueId, 
                        name: league.name, 
                        nameShort: league.nameShort, 
                        round: fixtureData.league.round 
                    }
                }];
            }
            return prev; 
        });
    };

    // --- 4. FETCH FIXTURES (USANDO SERVICIO) ---
    const fetchFixtures = useCallback(async (leagueId, roundName) => {
        if (!leagueId || !roundName) return;
        setIsLoading(true);
        setApiError(null);
        try {
            // Usamos el helper. Nota que el endpoint es 'fixtures'
            const data = await fetchFromApi('fixtures', `?league=${leagueId}&season=${SEASON_YEAR}&round=${encodeURIComponent(roundName)}&timezone=America/Mexico_City`);
            setApiFixtures(data.response || []);
        } catch (err) {
            setApiError(`Fallo al cargar partidos`);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        if (selectedRound && selectedLeagueId) {
            fetchFixtures(selectedLeagueId, selectedRound);
        }
    }, [selectedLeagueId, selectedRound, fetchFixtures]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentAdminId || deadlineError) return;

        isSubmittingRef.current = true;
        const quinielaPayload = {
            metadata: { 
                title, 
                description, 
                deadline, 
                createdBy: currentAdminId, 
                createdAt: new Date().toISOString(),
                status: 'open' 
            },
            fixtures: selectedFixtures.map(f => ({
                id: f.fixture.id, 
                leagueId: f.league.id, 
                leagueName: f.league.name,
                round: f.league.round, 
                homeTeam: f.teams.home.name, 
                awayTeam: f.teams.away.name,
                homeLogo: f.teams.home.logo, 
                awayLogo: f.teams.away.logo,
                matchDate: f.fixture.date,
                result: null 
            })),
        };

        try {
            await saveFinalQuiniela(quinielaPayload);
            await deleteDraftFromFirebase(currentAdminId);
            alert(`¡Quiniela creada con éxito!`);
            initialLoadRef.current = true;
            setTitle(''); setDescription(''); setDeadline(''); setSelectedRound(''); setSelectedFixtures([]);
        } catch (error) {
            console.error(error);
            alert("Error al guardar la quiniela.");
        } finally {
            setTimeout(() => { isSubmittingRef.current = false; initialLoadRef.current = false; }, 1000);
        }
    };

    const isReadyToSubmit = title && deadline && selectedFixtures.length === MAX_FIXTURES && !deadlineError && !isLoading;

    // --- JSX (SIN CAMBIOS VISUALES) ---
    return (
        <DashboardLayout isAdmin={true}>
             <div className="p-6 max-w-screen-xl mx-auto w-full"> 
                <h2 className="text-3xl font-bold text-red-700 mb-8 border-b pb-3">
                    ✍️ Crear Nueva Quiniela (Máx. {MAX_FIXTURES} Partidos)
                </h2>
                
                {isSaving && !isSubmittingRef.current && (
                    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 p-2 rounded-lg text-sm z-50">
                        Guardando borrador...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3 space-y-8 bg-white p-6 rounded-xl shadow-lg h-fit"> 
                        <section className="space-y-6 border-b pb-6 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">1. Datos Generales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm mb-1 font-bold text-gray-700">Título</label> 
                                    <input id="title" name="title" type="text" required value={title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: Quiniela Jornada 10" />
                                </div>
                                <div>
                                    <label htmlFor="deadline" className="block text-sm mb-1 font-bold text-gray-700">
                                        Cierre de Apuestas (Automático)
                                    </label> 
                                    <input 
                                        id="deadline" 
                                        name="deadline" 
                                        type="datetime-local" 
                                        required 
                                        value={deadline} 
                                        onChange={handleInputChange} 
                                        className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:bg-white transition-colors ${deadlineError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`} 
                                    />
                                    <p className="text-[10px] text-blue-500 mt-1">
                                        * Se configura automáticamente 1 hora antes del primer juego.
                                    </p>
                                    {deadlineError && <p className="text-red-500 text-[10px] mt-1 font-bold">{deadlineError}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">Descripción</label>
                                        <span className={`text-[10px] ${description.length >= MAX_DESCRIPTION_CHARS ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {description.length} / {MAX_DESCRIPTION_CHARS}
                                        </span>
                                    </div>
                                    <textarea id="description" name="description" rows="2" value={description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Instrucciones breves o premios..." />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4 border-b pb-6 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">2. Selección de Partidos</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="league-select" className="block text-sm font-medium text-gray-700 mb-1">Liga</label>
                                    <select id="league-select" value={selectedLeagueId} onChange={handleLeagueChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        {DUMMY_LEAGUES.map(league => (<option key={league.id} value={league.id}>{league.nameShort}</option>))}
                                    </select>
                                </div>
                                <div className="col-span-2 relative">
                                    <label htmlFor="round-select" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jornada {isLoadingRounds && <span className="text-blue-500 animate-pulse text-xs">(Buscando actual...)</span>}
                                    </label>
                                    <select 
                                        id="round-select" 
                                        value={selectedRound} 
                                        onChange={handleRoundChange} 
                                        disabled={isLoadingRounds || availableRounds.length === 0} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">
                                            {isLoadingRounds ? "Cargando jornadas..." : "-- Selecciona una Jornada --"}
                                        </option>
                                        {availableRounds.map(round => (
                                            <option key={round} value={round}>
                                                {round} {round === selectedRound ? "(Actual)" : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {isLoading && <p className="text-center text-blue-500 font-semibold mt-4 animate-pulse">Cargando partidos de la API...</p>}
                            {apiError && <p className="text-center text-red-500 text-sm font-bold mt-2">{apiError}</p>}
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">3. Partidos Disponibles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {apiFixtures.length === 0 && !isLoading && (
                                    <div className="col-span-2 text-center py-8 text-gray-400 italic border-2 border-dashed rounded-xl">
                                        Selecciona una liga y jornada para ver los partidos.
                                    </div>
                                )}
                                {apiFixtures.map((fixtureData) => {
                                    const fixture = fixtureData.fixture;
                                    const teams = fixtureData.teams;
                                    const date = new Date(fixture.date);
                                    const isSelected = selectedFixtures.some(f => f.fixture.id === fixture.id);
                                    return (
                                        <div 
                                            key={fixture.id} onClick={() => toggleFixtureSelection(fixtureData)}
                                            className={`p-4 rounded-xl shadow-sm cursor-pointer transition-all duration-200 border-2 relative overflow-hidden group
                                                        ${isSelected ? 'border-green-500 bg-green-50 ring-1 ring-green-300' : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-md'}`}
                                        >
                                            <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex justify-between">
                                                <span>{date.toLocaleDateString()}</span>
                                                <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center space-x-2">
                                                <div className="flex flex-col items-center w-5/12 text-center group-hover:scale-105 transition-transform">
                                                    <img src={teams.home.logo} alt={teams.home.name} className="w-10 h-10 mb-1 object-contain" />
                                                    <span className="font-bold text-xs text-gray-800 leading-tight">{teams.home.nameShort || teams.home.name}</span>
                                                </div>
                                                <span className="text-xs font-black text-gray-300">VS</span>
                                                <div className="flex flex-col items-center w-5/12 text-center group-hover:scale-105 transition-transform">
                                                    <img src={teams.away.logo} alt={teams.away.name} className="w-10 h-10 mb-1 object-contain" />
                                                    <span className="font-bold text-xs text-gray-800 leading-tight">{teams.away.nameShort || teams.away.name}</span>
                                                </div>
                                            </div>
                                            
                                            {isSelected && (
                                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold shadow-sm">
                                                    SELECCIONADO
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="lg:w-1/3 space-y-6">
                        <div className="sticky top-6 bg-slate-900 text-white p-6 rounded-xl shadow-2xl">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
                                <h3 className="text-lg font-bold text-blue-400">Tu Quiniela</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedFixtures.length === MAX_FIXTURES ? 'bg-green-500 text-white' : 'bg-slate-700 text-gray-300'}`}>
                                    {selectedFixtures.length} / {MAX_FIXTURES}
                                </span>
                            </div>
                            
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 mb-6 custom-scrollbar-dark">
                                {selectedFixtures.length === 0 && (
                                    <p className="text-slate-500 text-sm text-center italic py-4">Aún no has seleccionado partidos.</p>
                                )}
                                {selectedFixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)).map((f) => (
                                    <div key={f.fixture.id} className="p-3 border border-slate-700 rounded-lg bg-slate-800 relative group hover:bg-slate-750 transition-colors">
                                        <button 
                                            type="button" 
                                            onClick={() => toggleFixtureSelection(f)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                            title="Eliminar partido"
                                        >
                                            ✕
                                        </button>
                                        
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center space-x-2 w-5/12 overflow-hidden">
                                                <img src={f.teams.home.logo} className="w-5 h-5 object-contain" alt="" />
                                                <span className="font-semibold truncate">{f.teams.home.nameShort || f.teams.home.name.substring(0, 10)}</span>
                                            </div>
                                            <span className="text-slate-500 text-xs">vs</span>
                                            <div className="flex items-center justify-end space-x-2 w-5/12 overflow-hidden">
                                                <span className="font-semibold truncate">{f.teams.away.nameShort || f.teams.away.name.substring(0, 10)}</span>
                                                <img src={f.teams.away.logo} className="w-5 h-5 object-contain" alt="" />
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-2 text-center">
                                            {new Date(f.fixture.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                type="submit" 
                                disabled={!isReadyToSubmit || isSubmittingRef.current} 
                                className="w-full py-4 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg"
                            >
                                {isSubmittingRef.current ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        CREANDO...
                                    </span>
                                ) : 'CONFIRMAR QUINIELA'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateQuiniela;