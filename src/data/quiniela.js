// Datos de quinielas de ejemplo
export const QUINIELAS = [
  {
    id: 1,
    title: "Quiniela Semanal #45",
    league: "Mixto Internacional",
    leagueCode: "mixto",
    deadline: "2024-03-20T18:00:00",
    participants: 128,
    matches: 9,
    status: "open",
    featured: true,
    urgent: true,
    creator: "Admin Principal",
    matchesList: [
      { id: 1, local: "América", visitor: "Chivas", league: "Liga MX", date: "Mar 21, 20:00" },
      { id: 2, local: "Manchester City", visitor: "Liverpool", league: "Premier League", date: "Mar 22, 14:30" },
      { id: 3, local: "Barcelona", visitor: "Real Madrid", league: "La Liga", date: "Mar 23, 16:15" },
      { id: 4, local: "Bayern Munich", visitor: "Borussia Dortmund", league: "Bundesliga", date: "Mar 24, 13:30" },
      { id: 5, local: "PSG", visitor: "Marseille", league: "Ligue 1", date: "Mar 25, 21:00" }
    ]
  },
  {
    id: 2,
    title: "Champions League - Octavos",
    league: "Champions League",
    leagueCode: "champions",
    deadline: "2024-03-18T22:00:00",
    participants: 254,
    matches: 9,
    status: "open",
    featured: false,
    urgent: true,
    creator: "Admin Principal",
    matchesList: [
      { id: 1, local: "Real Madrid", visitor: "Manchester City", league: "Champions", date: "Mar 19, 21:00" },
      { id: 2, local: "Bayern Munich", visitor: "PSG", league: "Champions", date: "Mar 20, 21:00" }
    ]
  },
  {
    id: 3,
    title: "Liga MX - Jornada 12",
    league: "Liga MX",
    leagueCode: "liga-mx",
    deadline: "2024-03-25T23:59:00",
    participants: 87,
    matches: 9,
    status: "open",
    featured: false,
    urgent: false,
    creator: "Admin Principal",
    matchesList: [
      { id: 1, local: "Monterrey", visitor: "Tigres", league: "Liga MX", date: "Mar 26, 19:00" },
      { id: 2, local: "Pachuca", visitor: "Toluca", league: "Liga MX", date: "Mar 27, 20:06" }
    ]
  },
  {
    id: 4,
    title: "Quiniela #44 - Finalizada",
    league: "Mixto",
    leagueCode: "mixto",
    deadline: "2024-03-10T18:00:00",
    participants: 95,
    matches: 9,
    status: "closed",
    featured: false,
    urgent: false,
    creator: "Admin Principal",
    results: {
      winner: "FutbolMaster22",
      winnerScore: "8/9",
      maxScore: "8 de 9 aciertos",
      userScore: "6/9",
      top3: ["FutbolMaster22 (8)", "ProdeKing (7)", "AciertosTotal (7)"]
    },
    userPrediction: [1, 0, 2, 1, 0, 1, 2, 0, 1]
  },
  {
    id: 5,
    title: "Premier League - Fecha 30",
    league: "Premier League",
    leagueCode: "premier",
    deadline: "2024-03-28T15:00:00",
    participants: 156,
    matches: 9,
    status: "open",
    featured: false,
    urgent: false,
    creator: "Admin Principal"
  }
];