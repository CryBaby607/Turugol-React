// Rutas y secciones de la aplicación
export const ROUTES = {
  HOME: '/',
  ACTIVE_POOLS: 'activas',
  CLOSED_POOLS: 'cerradas',
  MY_PARTICIPATIONS: 'participaciones',
  ADMIN_PANEL: '/admin',
};

export const SECTIONS = [
  {
    id: 'activas',
    label: '🎯 Quinielas Activas',
    icon: '🎯',
  },
  {
    id: 'cerradas',
    label: '📊 Resultados',
    icon: '📊',
  },
  {
    id: 'participaciones',
    label: '📜 Mis Participaciones',
    icon: '📜',
  },
];

export const LEAGUES = [
  { value: 'all', label: 'Todas las ligas' },
  { value: 'liga-mx', label: '🇲🇽 Liga MX' },
  { value: 'premier', label: '⚽ Premier League' },
  { value: 'la-liga', label: '🇪🇸 La Liga' },
  { value: 'serie-a', label: '🇮🇹 Serie A' },
  { value: 'bundesliga', label: '🇩🇪 Bundesliga' },
  { value: 'champions', label: '🏆 Champions League' },
  { value: 'copa-america', label: '🇦🇷 Copa América' },
];

export const SORT_OPTIONS = [
  { value: 'deadline', label: 'Fecha límite cercana' },
  { value: 'newest', label: 'Más reciente' },
  { value: 'participants', label: 'Más participada' },
];

export const FOOTER_LEAGUES = [
  'Liga MX',
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Champions',
  'Copa América',
  '+8 más',
];

export const POOL_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

export const PREDICTION_VALUES = {
  LOCAL: '1',
  DRAW: '0',
  VISITOR: '2',
};