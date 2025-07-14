// src/components/educacion/CreateAlertaModal.jsx
import React, { useState, useEffect } from 'react';
import { createAlerta } from '../../api/alertas'; // Asegúrate de tener esta función en tu API
import { getCategorias } from '../../api/categoria'; // Necesario para alertas de gasto_limite
import { getMetas } from '../../api/metas'; // Necesario para alertas de meta
import { FaTimes, FaPlusCircle } from 'react-icons/fa'; // Iconos

const CreateAlertaModal = ({ isOpen, onClose, onCreateSuccess }) => {
    const [mensaje, setMensaje] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('recordatorio');
    const [fechaAlerta, setFechaAlerta] = useState(() => new Date().toISOString().split('T')[0]);
    const [parametros, setParametros] = useState({}); // Para guardar los parámetros JSON
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para campos condicionales
    const [categorias, setCategorias] = useState([]);
    const [metas, setMetas] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [gastoLimiteMonto, setGastoLimiteMonto] = useState('');
    const [selectedMeta, setSelectedMeta] = useState('');
    const [metaProgresoPorcentaje, setMetaProgresoPorcentaje] = useState('');

    useEffect(() => {
        // Cargar categorías y metas cuando el modal se abre
        if (isOpen) {
            const fetchDependencies = async () => {
                try {
                    const catRes = await getCategorias();
                    setCategorias(catRes.data);
                    const metaRes = await getMetas();
                    setMetas(metaRes.data);
                } catch (err) {
                    console.error("Error al cargar dependencias para alertas:", err);
                    setError('Error al cargar categorías o metas.');
                }
            };
            fetchDependencies();
        }
    }, [isOpen]);

    // Resetear campos condicionales cuando cambia el tipo de alerta
    useEffect(() => {
        setSelectedCategoria('');
        setGastoLimiteMonto('');
        setSelectedMeta('');
        setMetaProgresoPorcentaje('');
        setParametros({});
    }, [tipoAlerta]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        let finalParams = {};

        // Validaciones y construcción de parámetros según el tipo de alerta
        if (!mensaje.trim()) {
            setError('El mensaje de la alerta es obligatorio.');
            setIsLoading(false);
            return;
        }
        if (!fechaAlerta) {
            setError('La fecha de la alerta es obligatoria.');
            setIsLoading(false);
            return;
        }
        if (new Date(fechaAlerta) < new Date().setHours(0,0,0,0)) { // Fecha no puede ser pasada
            setError('La fecha de la alerta no puede ser en el pasado.');
            setIsLoading(false);
            return;
        }

        if (tipoAlerta === 'gasto_limite') {
            if (!selectedCategoria || !gastoLimiteMonto || parseFloat(gastoLimiteMonto) <= 0) {
                setError('Para alerta de gasto límite, selecciona una categoría y un monto válido.');
                setIsLoading(false);
                return;
            }
            finalParams = {
                categoria_id: parseInt(selectedCategoria),
                limite_monto: parseFloat(gastoLimiteMonto)
            };
        } else if (tipoAlerta === 'meta') {
            if (!selectedMeta || !metaProgresoPorcentaje || parseFloat(metaProgresoPorcentaje) <= 0 || parseFloat(metaProgresoPorcentaje) > 100) {
                setError('Para alerta de meta, selecciona una meta y un porcentaje de progreso válido (1-100).');
                setIsLoading(false);
                return;
            }
            finalParams = {
                meta_id: parseInt(selectedMeta),
                porcentaje_progreso: parseFloat(metaProgresoPorcentaje)
            };
        }

        try {
            await createAlerta({
                mensaje,
                tipo_alerta: tipoAlerta,
                fecha_alerta: fechaAlerta,
                parametros: finalParams // Asegúrate de que esto sea un objeto JSON
            });
            onCreateSuccess(); // Recargar alertas en la página principal
            onClose(); // Cerrar el modal
            // Limpiar formulario
            setMensaje('');
            setTipoAlerta('recordatorio');
            setFechaAlerta(new Date().toISOString().split('T')[0]);
            setParametros({});
        } catch (err) {
            console.error("Error al crear alerta:", err);
            setError(err.response?.data?.error || 'Error al crear la alerta. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
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
                    <FaPlusCircle className="text-blue-600" /> Crear Nueva Alerta
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-2">Mensaje:</label>
                        <input
                            type="text"
                            id="mensaje"
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                            placeholder="Ej: Revisar gastos de la semana"
                        />
                    </div>
                    <div>
                        <label htmlFor="tipoAlerta" className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Alerta:</label>
                        <select
                            id="tipoAlerta"
                            value={tipoAlerta}
                            onChange={(e) => setTipoAlerta(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300 appearance-none bg-white pr-8"
                        >
                            <option value="recordatorio">Recordatorio General</option>
                            <option value="gasto_limite">Límite de Gasto</option>
                            <option value="meta">Progreso de Meta</option>
                        </select>
                    </div>
                    
                    {/* Campos condicionales según el tipo de alerta */}
                    {tipoAlerta === 'gasto_limite' && (
                        <>
                            <div>
                                <label htmlFor="categoriaGasto" className="block text-sm font-semibold text-gray-700 mb-2">Categoría:</label>
                                <select
                                    id="categoriaGasto"
                                    value={selectedCategoria}
                                    onChange={(e) => setSelectedCategoria(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300 appearance-none bg-white pr-8"
                                >
                                    <option value="">-- Selecciona una categoría --</option>
                                    {categorias.filter(cat => cat.tipo === 'egreso').map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="montoLimite" className="block text-sm font-semibold text-gray-700 mb-2">Monto Límite (S/):</label>
                                <input
                                    type="number"
                                    id="montoLimite"
                                    step="0.01"
                                    value={gastoLimiteMonto}
                                    onChange={(e) => setGastoLimiteMonto(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="Ej: 200.00"
                                />
                            </div>
                        </>
                    )}

                    {tipoAlerta === 'meta' && (
                        <>
                            <div>
                                <label htmlFor="metaSeleccionada" className="block text-sm font-semibold text-gray-700 mb-2">Meta de Ahorro:</label>
                                <select
                                    id="metaSeleccionada"
                                    value={selectedMeta}
                                    onChange={(e) => setSelectedMeta(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300 appearance-none bg-white pr-8"
                                >
                                    <option value="">-- Selecciona una meta --</option>
                                    {metas.map(meta => (
                                        <option key={meta.id} value={meta.id}>{meta.titulo}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="porcentajeProgreso" className="block text-sm font-semibold text-gray-700 mb-2">Porcentaje de Progreso para Alerta (%):</label>
                                <input
                                    type="number"
                                    id="porcentajeProgreso"
                                    step="1"
                                    min="1"
                                    max="100"
                                    value={metaProgresoPorcentaje}
                                    onChange={(e) => setMetaProgresoPorcentaje(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    placeholder="Ej: 80 (al alcanzar el 80% de la meta)"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="fechaAlerta" className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Alerta:</label>
                        <input
                            type="date"
                            id="fechaAlerta"
                            value={fechaAlerta}
                            onChange={(e) => setFechaAlerta(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
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
                        className="w-full bg-gradient-to-r from-blue-600 to-sky-700 text-white
                                   py-3.5 rounded-lg font-bold text-lg shadow-lg
                                   hover:from-blue-700 hover:to-sky-800
                                   transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl
                                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75
                                   disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creando Alerta...</span>
                            </>
                        ) : 'Crear Alerta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAlertaModal;
