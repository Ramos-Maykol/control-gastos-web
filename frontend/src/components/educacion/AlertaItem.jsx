// src/components/educacion/AlertaItem.jsx
import React from 'react';
import { FaBell, FaCheckCircle, FaMoneyBillWave, FaCalendarAlt, FaBullseye } from 'react-icons/fa'; // Iconos

const AlertaItem = ({ alerta, onMarkAsRead }) => {
    // Determinar el icono y color según el tipo de alerta
    let icon = <FaBell className="text-blue-500" />;
    let bgColor = 'bg-blue-50';
    let borderColor = 'border-blue-200';

    switch (alerta.tipo_alerta) {
        case 'gasto_limite':
            icon = <FaMoneyBillWave className="text-red-500" />;
            bgColor = 'bg-red-50';
            borderColor = 'border-red-200';
            break;
        case 'recordatorio':
            icon = <FaCalendarAlt className="text-purple-500" />;
            bgColor = 'bg-purple-50';
            borderColor = 'border-purple-200';
            break;
        case 'meta':
            icon = <FaBullseye className="text-green-500" />;
            bgColor = 'bg-green-50';
            borderColor = 'border-green-200';
            break;
        default:
            break;
    }

    return (
        <div className={`
            flex items-center justify-between p-4 rounded-xl shadow-sm border ${bgColor} ${borderColor}
            transition-all duration-200 ease-in-out hover:shadow-md
        `}>
            <div className="flex items-center gap-4">
                <div className="text-3xl flex-shrink-0">{icon}</div>
                <div>
                    <p className="font-semibold text-gray-800 text-lg">{alerta.mensaje}</p>
                    <p className="text-sm text-gray-600">
                        Tipo: <span className="font-medium">{alerta.tipo_alerta.replace('_', ' ')}</span> | Fecha: {new Date(alerta.fecha_alerta).toLocaleDateString('es-PE')}
                    </p>
                    {alerta.parametros && (
                        <p className="text-xs text-gray-500 mt-1">
                            Parámetros: {JSON.stringify(alerta.parametros)}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={() => onMarkAsRead(alerta.id)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium
                           hover:bg-gray-300 transition-colors duration-200"
                aria-label="Marcar como leída"
            >
                <FaCheckCircle /> Leída
            </button>
        </div>
    );
};

export default AlertaItem;
