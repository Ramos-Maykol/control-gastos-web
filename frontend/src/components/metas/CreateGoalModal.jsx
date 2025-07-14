// src/components/metas/CreateGoalModal.jsx
import React, { useState } from 'react';
import { createMeta } from '../../api/metas';
import { FaTimes, FaPlusCircle } from 'react-icons/fa'; // Iconos

const CreateGoalModal = ({ isOpen, onClose, onCreateSuccess }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [montoObjetivo, setMontoObjetivo] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validaciones en el frontend
        if (!titulo.trim() || !montoObjetivo || !fechaFin) {
            setError('Todos los campos obligatorios deben ser llenados.');
            setIsLoading(false);
            return;
        }
        if (parseFloat(montoObjetivo) <= 0) {
            setError('El monto objetivo debe ser mayor a 0.');
            setIsLoading(false);
            return;
        }
        if (new Date(fechaFin) <= new Date()) {
            setError('La fecha límite debe ser en el futuro.');
            setIsLoading(false);
            return;
        }

        try {
            await createMeta({
                titulo,
                descripcion: descripcion.trim(),
                monto_objetivo: parseFloat(montoObjetivo),
                fecha_fin: fechaFin
            });
            onCreateSuccess(); // Llama a la función para recargar metas en la página principal
            onClose(); // Cierra el modal
            // Limpiar formulario
            setTitulo('');
            setDescripcion('');
            setMontoObjetivo('');
            setFechaFin('');
        } catch (err) {
            console.error("Error al crear la meta:", err);
            setError(err.response?.data?.error || 'Error al crear la meta. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        // CAMBIO CLAVE AQUÍ: Usamos `top-[var(--header-height)]` para desplazar el modal hacia abajo.
        // `var(--header-height)` se define en `App.css` (normalmente 60px).
        <div className="fixed left-0 right-0 bottom-0 top-[var(--header-height)] bg-black bg-opacity-60 flex items-center justify-center z-[9999] animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-slide-in-up
                        border border-gray-200">
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors duration-200" 
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                    <FaPlusCircle className="text-indigo-600" /> Crear Nueva Meta
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">Título:</label>
                        <input
                            type="text"
                            id="titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                            placeholder="Ej: Viaje a la selva, Nuevo gadget"
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">Descripción (opcional):</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 resize-y"
                            placeholder="Detalles sobre tu meta..."
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="montoObjetivo" className="block text-sm font-semibold text-gray-700 mb-2">Monto Objetivo (S/):</label>
                        <input
                            type="number"
                            id="montoObjetivo"
                            step="0.01"
                            value={montoObjetivo}
                            onChange={(e) => setMontoObjetivo(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                            placeholder="Ej: 500.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="fechaFin" className="block text-sm font-semibold text-gray-700 mb-2">Fecha Límite:</label>
                        <input
                            type="date"
                            id="fechaFin"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
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
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white
                                   py-3.5 rounded-lg font-bold text-lg shadow-lg
                                   hover:from-indigo-700 hover:to-purple-800
                                   transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl
                                   focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75
                                   disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creando...</span>
                            </>
                        ) : 'Crear Meta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;
