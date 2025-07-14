// src/components/metas/UpdateProgressModal.jsx
import React, { useState, useEffect } from 'react';
import { updateMetaProgress } from '../../api/metas';
import { FaTimes, FaPlus } from 'react-icons/fa'; // Iconos

const UpdateProgressModal = ({ isOpen, onClose, goal, onUpdateSuccess }) => {
    const [montoToAdd, setMontoToAdd] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Reset montoToAdd and error when modal opens or goal changes
        if (isOpen) {
            setMontoToAdd('');
            setError('');
        }
    }, [isOpen, goal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!montoToAdd || parseFloat(montoToAdd) <= 0) {
            setError('Ingrese un monto válido mayor a 0.');
            setIsLoading(false);
            return;
        }

        try {
            await updateMetaProgress(goal.id, parseFloat(montoToAdd));
            onUpdateSuccess(); // Recarga las metas en la página principal
            onClose(); // Cierra el modal
        } catch (err) {
            console.error("Error al actualizar el progreso:", err);
            setError(err.response?.data?.error || 'Error al actualizar el progreso.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !goal) return null;

    const montoActual = parseFloat(goal.monto_actual);
    const montoObjetivo = parseFloat(goal.monto_objetivo);
    const montoRestante = montoObjetivo - montoActual;

    return (
        // El z-index ya está en z-[9999], que es el valor más alto posible en Tailwind.
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-slide-in-up
                        border border-gray-200">
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors duration-200" 
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                    <FaPlus className="text-green-600" /> Añadir Progreso
                </h2>
                <p className="text-gray-700 text-lg mb-2">Meta: <span className="font-semibold">{goal.titulo}</span></p>
                <p className="text-gray-600 mb-4">Monto actual: <span className="font-bold text-indigo-600">S/ {montoActual.toFixed(2)}</span> / Monto restante: <span className="font-bold text-orange-500">S/ {montoRestante.toFixed(2)}</span></p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="montoToAdd" className="block text-sm font-semibold text-gray-700 mb-2">Monto a añadir (S/):</label>
                        <input
                            type="number"
                            id="montoToAdd"
                            step="0.01"
                            value={montoToAdd}
                            onChange={(e) => setMontoToAdd(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                            placeholder="Ej: 25.00"
                        />
                    </div>
                    {error && (
                        <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200 animate-fade-in">
                            {error}
                        </p>
                    )}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-700 text-white
                                   py-3.5 rounded-lg font-bold text-lg shadow-lg
                                   hover:from-green-700 hover:to-teal-800
                                   transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl
                                   focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75
                                   disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Añadiendo...</span>
                            </>
                        ) : 'Añadir Progreso'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProgressModal;
