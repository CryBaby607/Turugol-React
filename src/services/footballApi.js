const BASE_URL = 'https://v3.football.api-sports.io';
const HEADERS = {
    'x-rapidapi-key': import.meta.env.VITE_API_FOOTBALL_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
};

export const getFixtures = async (leagueId, round) => {
    // ... lógica del fetch ...
};
