// src/pages/MetasAhorro/MetasAhorroPage.jsx
import React, { useState, useEffect } from 'react';
import { getMetas, createMeta, updateMetaProgress } from '../../api/metas';
import './MetasAhorroPage.css'; // Crearemos este archivo CSS

// Componente para la tarjeta de una meta individual
const GoalCard = ({ goal, onUpdateProgressClick }) => {
    // Asegurarse de que los montos sean números para los cálculos
    const montoActual = parseFloat(goal.monto_actual);
    const montoObjetivo = parseFloat(goal.monto_objetivo);
    const progreso = montoObjetivo > 0 ? (montoActual / montoObjetivo) * 100 : 0;
    const diasRestantes = Math.ceil((new Date(goal.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24));
    const isCompleted = montoActual >= montoObjetivo;

    return (
        <div className={`goal-card ${isCompleted ? 'goal-card--completed' : ''}`}>
            <h3 className="goal-card__title">{goal.titulo}</h3>
            {goal.descripcion && <p className="goal-card__description">{goal.descripcion}</p>}
            
            <div className="goal-card__amounts">
                <span className="goal-card__current">S/ {montoActual.toFixed(2)}</span> / <span className="goal-card__target">S/ {montoObjetivo.toFixed(2)}</span>
            </div>

            <div className="goal-card__progress-bar">
                <div className="goal-card__progress-fill" style={{ width: `${Math.min(progreso, 100)}%` }}></div>
                <span className="goal-card__progress-text">{progreso.toFixed(1)}%</span>
            </div>

            <div className="goal-card__info">
                {isCompleted ? (
                    <span className="goal-card__status goal-card__status--completed">¡Meta Completada! 🎉</span>
                ) : (
                    <span className="goal-card__status">Faltan {diasRestantes > 0 ? `${diasRestantes} días` : '0 días'}</span>
                )}
                <span className="goal-card__date">Fecha Fin: {new Date(goal.fecha_fin).toLocaleDateString('es-PE')}</span>
            </div>

            {!isCompleted && (
                <button 
                    className="goal-card__add-progress-btn" 
                    onClick={() => onUpdateProgressClick(goal)}
                >
                    Añadir Progreso
                </button>
            )}
        </div>
    );
};

// Componente Modal para crear una nueva meta
const CreateGoalModal = ({ isOpen, onClose, onCreateSuccess }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [montoObjetivo, setMontoObjetivo] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!titulo || !montoObjetivo || !fechaFin) {
            setError('Todos los campos obligatorios deben ser llenados.');
            return;
        }
        if (parseFloat(montoObjetivo) <= 0) {
            setError('El monto objetivo debe ser mayor a 0.');
            return;
        }
        if (new Date(fechaFin) <= new Date()) {
            setError('La fecha final debe ser futura.');
            return;
        }

        try {
            await createMeta({
                titulo,
                descripcion,
                monto_objetivo: parseFloat(montoObjetivo), // Asegurar que se envía como número
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
            setError(err.response?.data?.error || 'Error al crear la meta.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Crear Nueva Meta de Ahorro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="titulo">Título:</label>
                        <input
                            type="text"
                            id="titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción (opcional):</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="montoObjetivo">Monto Objetivo (S/):</label>
                        <input
                            type="number"
                            id="montoObjetivo"
                            step="0.01"
                            value={montoObjetivo}
                            onChange={(e) => setMontoObjetivo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha Límite:</label>
                        <input
                            type="date"
                            id="fechaFin"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn btn-primary">Crear Meta</button>
                </form>
            </div>
        </div>
    );
};

// Componente Modal para actualizar el progreso de una meta
const UpdateProgressModal = ({ isOpen, onClose, goal, onUpdateSuccess }) => {
    const [montoToAdd, setMontoToAdd] = useState('');
    const [error, setError] = useState('');

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
        if (!montoToAdd || parseFloat(montoToAdd) <= 0) {
            setError('Ingrese un monto válido mayor a 0.');
            return;
        }

        try {
            await updateMetaProgress(goal.id, parseFloat(montoToAdd));
            onUpdateSuccess(); // Recarga las metas
            onClose(); // Cierra el modal
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar el progreso.');
        }
    };

    if (!isOpen || !goal) return null;

    const montoActual = parseFloat(goal.monto_actual);
    const montoObjetivo = parseFloat(goal.monto_objetivo);
    const montoRestante = montoObjetivo - montoActual;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Añadir Progreso a: {goal.titulo}</h2>
                <p>Monto actual: S/ {montoActual.toFixed(2)}</p>
                <p>Monto restante: S/ {montoRestante.toFixed(2)}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="montoToAdd">Monto a añadir (S/):</label>
                        <input
                            type="number"
                            id="montoToAdd"
                            step="0.01"
                            value={montoToAdd}
                            onChange={(e) => setMontoToAdd(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn btn-primary">Añadir</button>
                </form>
            </div>
        </div>
    );
};


const MetasAhorroPage = () => {
    const [metas, setMetas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateProgressModal, setShowUpdateProgressModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const fetchMetas = async () => {
        setIsLoading(true);
        try {
            const data = await getMetas();
            // Asegurarse de que monto_objetivo y monto_actual sean números
            const formattedMetas = data.map(meta => ({
                ...meta,
                monto_objetivo: parseFloat(meta.monto_objetivo),
                monto_actual: parseFloat(meta.monto_actual)
            }));
            setMetas(formattedMetas);
        } catch (error) {
            console.error("Error al cargar las metas de ahorro:", error);
            // Podrías mostrar un mensaje de error al usuario
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMetas();
    }, []);

    const handleCreateSuccess = () => {
        fetchMetas(); // Recargar la lista de metas después de crear una nueva
    };

    const handleUpdateProgressClick = (goal) => {
        setSelectedGoal(goal);
        setShowUpdateProgressModal(true);
    };

    const handleUpdateSuccess = () => {
        fetchMetas(); // Recargar la lista de metas después de actualizar el progreso
    };


    if (isLoading) {
        return <div className="metas-container"><p>Cargando metas de ahorro...</p></div>;
    }

    return (
        <div className="metas-container">
            <h1 className="metas-title">Mis Metas de Ahorro 🎯</h1>

            <div className="metas-header">
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    + Crear Nueva Meta
                </button>
            </div>

            {metas.length === 0 ? (
                <p className="no-metas-message">No tienes metas de ahorro registradas. ¡Crea una para empezar a ahorrar!</p>
            ) : (
                <div className="goals-grid">
                    {metas.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onUpdateProgressClick={handleUpdateProgressClick} />
                    ))}
                </div>
            )}

            <CreateGoalModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateSuccess={handleCreateSuccess}
            />

            <UpdateProgressModal
                isOpen={showUpdateProgressModal}
                onClose={() => setShowUpdateProgressModal(false)}
                goal={selectedGoal}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
};

export default MetasAhorroPage;
