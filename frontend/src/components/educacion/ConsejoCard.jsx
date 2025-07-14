// src/components/educacion/ConsejoCard.jsx
import React from 'react';
import { FaThumbsUp, FaThumbsDown, FaLightbulb, FaBookOpen, FaPiggyBank } from 'react-icons/fa'; // Iconos

const ConsejoCard = ({ consejo, onVote }) => {
    // Determinar el color del icono de dificultad
    const dificultadColor = {
        'básico': 'text-green-500',
        'intermedio': 'text-yellow-500',
        'avanzado': 'text-red-500',
    }[consejo.dificultad] || 'text-gray-500';

    // Determinar el icono según el público objetivo
    const publicoIcon = {
        'general': <FaLightbulb />,
        'universitario': <FaBookOpen />,
        'ahorro': <FaPiggyBank />,
    }[consejo.publico_objetivo] || <FaLightbulb />;

    const totalVotos = consejo.votos_positivos + consejo.votos_negativos;
    const popularidad = totalVotos > 0 ? ((consejo.votos_positivos - consejo.votos_negativos) / totalVotos) * 100 : 0;

    // Clases para el borde de la tarjeta según la popularidad
    const borderColorClass = popularidad > 50 ? 'border-green-400' :
                             popularidad < -20 ? 'border-red-400' :
                             'border-blue-200';

    return (
        <div className={`
            bg-white p-6 rounded-2xl shadow-lg flex flex-col transition-all duration-300 ease-in-out
            hover:scale-[1.02] hover:shadow-xl cursor-pointer border-l-4 ${borderColorClass}
        `}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 leading-tight pr-4">{consejo.titulo}</h3>
                <div className="flex-shrink-0 text-3xl text-gray-400">
                    {publicoIcon}
                </div>
            </div>
            <p className="text-gray-700 text-base mb-4 flex-grow">{consejo.contenido}</p>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className={`font-semibold ${dificultadColor}`}>
                    Dificultad: {consejo.dificultad}
                </span>
                <span className="italic">Público: {consejo.publico_objetivo}</span>
            </div>

            {/* Sección de Votación */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onVote(consejo.id, 'positivo')}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors duration-200
                                   transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-full p-1"
                        aria-label="Votar positivo"
                    >
                        <FaThumbsUp className="text-xl" />
                        <span className="font-semibold">{consejo.votos_positivos}</span>
                    </button>
                    <button 
                        onClick={() => onVote(consejo.id, 'negativo')}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors duration-200
                                   transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full p-1"
                        aria-label="Votar negativo"
                    >
                        <FaThumbsDown className="text-xl" />
                        <span className="font-semibold">{consejo.votos_negativos}</span>
                    </button>
                </div>
                <span className="text-gray-500 text-sm">
                    Popularidad: <span className="font-bold">{popularidad.toFixed(0)}%</span>
                </span>
            </div>
        </div>
    );
};

export default ConsejoCard;
