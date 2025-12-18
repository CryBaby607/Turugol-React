import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from './Carousel';

const Hero = () => {
  return (
    <section className="bg-black text-white">
      <div className="container mx-auto px-4 hero-container flex items-center">
        <div className="flex flex-col lg:flex-row items-stretch w-full">
          {/* Columna izquierda: Descripción */}
          <div className="lg:w-1/2 lg:pr-12 py-12 lg:py-24 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Demuestra que sabes de fútbol. <span className="text-amber-300">Compite en quinielas</span> con tus amigos.
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Únete a la comunidad más grande de pronósticos deportivos y demuestra quién es el verdadero experto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-center"
              >
                Comenzar ahora
              </Link>
              <Link 
                to="#quinielas" 
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                Ver quinielas
              </Link>
            </div>
          </div>
          
          {/* Columna derecha: Carrusel que ocupa todo el alto */}
          <div className="lg:w-1/2 carousel-column relative">
            <Carousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;