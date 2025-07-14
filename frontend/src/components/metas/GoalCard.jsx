// src/components/metas/GoalCard.jsx
import React from 'react';
import { FaCheckCircle, FaLeaf, FaPaw } from 'react-icons/fa'; // Iconos de ejemplo, asegúrate de tener react-icons instalado

const GoalCard = ({ goal, onUpdateProgressClick }) => {
    // Asegurarse de que los montos sean números para los cálculos
    const montoActual = parseFloat(goal.monto_actual);
    const montoObjetivo = parseFloat(goal.monto_objetivo);
    const progreso = montoObjetivo > 0 ? (montoActual / montoObjetivo) * 100 : 0;
    const diasRestantes = Math.ceil((new Date(goal.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24));
    const isCompleted = montoActual >= montoObjetivo;

    // Clases dinámicas para la barra de progreso
    const progressBarColor = isCompleted ? 'bg-green-500' : 'bg-indigo-500';
    const progressTextColor = isCompleted ? 'text-green-800' : 'text-indigo-800';

    return (
        <div className={`
            bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-3 relative overflow-hidden
            transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl cursor-pointer
            ${isCompleted ? 'border-2 border-green-400 bg-green-50' : 'border border-gray-200'}
        `}>
            {/* Indicador de completado con animación */}
            {isCompleted && (
                <div className="absolute top-4 right-4 text-green-600 text-4xl animate-bounce-once">
                    <FaCheckCircle />
                </div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mb-1">{goal.titulo}</h3>
            {goal.descripcion && <p className="text-gray-600 text-sm mb-2">{goal.descripcion}</p>}
            
            <div className="flex justify-between items-baseline text-lg font-semibold text-gray-700">
                <span className="text-indigo-600">S/ {montoActual.toFixed(2)}</span>
                <span className="text-gray-500"> / S/ {montoObjetivo.toFixed(2)}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 relative mt-2">
                <div 
                    className={`h-full rounded-full ${progressBarColor} transition-all duration-500 ease-out`} 
                    style={{ width: `${Math.min(progreso, 100)}%` }}
                ></div>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${progressTextColor}`}>
                    {progreso.toFixed(1)}%
                </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
                {isCompleted ? (
                    <span className="font-bold text-green-600 flex items-center gap-1">
                        ¡Meta Completada! 🎉
                    </span>
                ) : (
                    <span className="font-medium text-gray-600 flex items-center gap-1">
                        <FaLeaf className="text-green-500" /> Faltan {diasRestantes > 0 ? `${diasRestantes} días` : '0 días'}
                    </span>
                )}
                <span className="text-xs italic">Fecha Límite: {new Date(goal.fecha_fin).toLocaleDateString('es-PE')}</span>
            </div>

            {!isCompleted && (
                <button 
                    className="mt-4 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold
                               hover:bg-indigo-200 transition-all duration-200 ease-in-out
                               transform hover:-translate-y-0.5 shadow-md hover:shadow-lg
                               flex items-center justify-center gap-2 self-end"
                    onClick={() => onUpdateProgressClick(goal)}
                >
                    <FaPaw className="text-indigo-500" /> Añadir Progreso
                </button>
            )}
        </div>
    );
};

export default GoalCard;
