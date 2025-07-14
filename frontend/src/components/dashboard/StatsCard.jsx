// src/components/dashboard/StatsCard.jsx
import React from 'react';

// Este componente ya no necesita importar un archivo CSS.
// Todos los estilos se manejan con clases de Tailwind CSS.

const StatsCard = ({ title, value, icon, type }) => {
    // Definimos los colores de borde y de fondo del icono según el tipo de tarjeta
    const borderColorClass = {
        income: 'border-green-500',    // Verde para ingresos
        expense: 'border-red-500',     // Rojo para gastos
        balance: 'border-blue-500',    // Azul para balance
        savings: 'border-orange-500',  // Naranja para ahorro
    }[type];

    const iconBgClass = {
        income: 'bg-green-100 text-green-600',
        expense: 'bg-red-100 text-red-600',
        balance: 'bg-blue-100 text-blue-600',
        savings: 'bg-orange-100 text-orange-600',
    }[type];

    return (
        <div className={`
            bg-white p-6 rounded-xl shadow-lg flex justify-between items-center
            border-l-4 ${borderColorClass}
            transition-all duration-300 ease-in-out
            hover:scale-[1.02] hover:shadow-xl cursor-pointer
        `}>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                ${iconBgClass}
            `}>
                {icon}
            </div>
        </div>
    );
};

export default StatsCard;
