import React from 'react';
import QuinielaCard from './QuinielaCard';

const QuinielasDestacadas = () => {
  const quinielas = [
    {
      id: 1,
      liga: "LIGA SANTANDER",
      categoria: "emerald",
      titulo: "Jornada 28",
      descripcion: "Pronostica los resultados de la jornada 28 de LaLiga.",
      participantes: 2450,
      tiempo: { valor: "3 días", texto: "Para jugar" },
      color: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        btn: "bg-emerald-600",
        btnHover: "bg-emerald-700"
      },
      textoBoton: "Unirme a esta quiniela"
    },
    {
      id: 2,
      liga: "CHAMPIONS LEAGUE",
      categoria: "amber",
      titulo: "Octavos de final",
      descripcion: "Pronostica los resultados de los octavos de final.",
      participantes: 5820,
      tiempo: { valor: "7 días", texto: "Para jugar" },
      color: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        btn: "bg-amber-500",
        btnHover: "bg-amber-600"
      },
      textoBoton: "Unirme a esta quiniela"
    },
    {
      id: 3,
      liga: "PREMIER LEAGUE",
      categoria: "blue",
      titulo: "Temporada completa",
      descripcion: "Pronostica el campeón y resultados de la Premier League.",
      participantes: 8150,
      tiempo: { valor: "En curso", texto: "Hasta mayo" },
      color: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        btn: "bg-emerald-600",
        btnHover: "bg-emerald-700"
      },
      textoBoton: "Unirme a esta quiniela"
    }
  ];

  const handleVerTodas = () => {
    alert('¡Redirigiendo a la página con todas las quinielas disponibles!');
  };

  return (
    <section id="quinielas" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-emerald-800">
          Quinielas destacadas
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Las quinielas más populares de la semana. ¡Únete a la competencia!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {quinielas.map((quiniela) => (
            <QuinielaCard key={quiniela.id} quiniela={quiniela} />
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={handleVerTodas}
            className="inline-block border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Ver todas las quinielas
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuinielasDestacadas;