// src/pages/EducacionFinanciera/EducacionFinancieraPage.jsx
import React, { useState, useEffect } from 'react';
import { getConsejos, voteConsejo } from '../../api/consejos'; // ¡Nombres de importación corregidos!
import ConsejoCard from '../../components/educacion/ConsejoCard';
import CreateAlertaModal from '../../components/educacion/CreateAlertaModal';
import { obtenerAlertasActivas, marcarComoLeida } from '../../api/alertas';
import AlertaItem from '../../components/educacion/AlertaItem';

const EducacionFinancieraPage = () => {
    const [consejos, setConsejos] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [isLoadingConsejos, setIsLoadingConsejos] = useState(true);
    const [isLoadingAlertas, setIsLoadingAlertas] = useState(true);
    const [errorConsejos, setErrorConsejos] = useState('');
    const [errorAlertas, setErrorAlertas] = useState('');

    const [filterPublico, setFilterPublico] = useState('general');
    const [filterDificultad, setFilterDificultad] = useState('básico');

    const [showCreateAlertaModal, setShowCreateAlertaModal] = useState(false);

    // --- Cargar Consejos ---
    const fetchConsejos = async () => {
        setIsLoadingConsejos(true);
        setErrorConsejos('');
        try {
            const response = await getConsejos({ publico: filterPublico, dificultad: filterDificultad }); // Usar getConsejos
            // Asumiendo que la respuesta de getConsejos es directamente el array de datos o tiene una propiedad .data
            const data = response.data || response; 
            setConsejos(data);
        } catch (err) {
            console.error("Error al cargar consejos:", err);
            setErrorConsejos('No se pudieron cargar los consejos. Intenta de nuevo más tarde.');
        } finally {
            setIsLoadingConsejos(false);
        }
    };

    useEffect(() => {
        fetchConsejos();
    }, [filterPublico, filterDificultad]);

    // --- Cargar Alertas ---
    const fetchAlertas = async () => {
        setIsLoadingAlertas(true);
        setErrorAlertas('');
        try {
            const response = await obtenerAlertasActivas();
            const data = response.data || response;
            setAlertas(data);
        } catch (err) {
            console.error("Error al cargar alertas:", err);
            setErrorAlertas('No se pudieron cargar tus alertas.');
        } finally {
            setIsLoadingAlertas(false);
        }
    };

    useEffect(() => {
        fetchAlertas();
    }, []);

    // --- Manejar Voto de Consejo ---
    const handleVote = async (id, voto) => {
        try {
            await voteConsejo(id, voto); // Usar voteConsejo
            // Después de votar, recargar los consejos para que el orden se actualice
            fetchConsejos();
        } catch (err) {
            console.error("Error al votar consejo:", err);
            // Podrías mostrar una notificación al usuario
        }
    };

    // --- Manejar Marcar Alerta como Leída ---
    const handleMarkAlertaAsRead = async (id) => {
        try {
            await marcarComoLeida(id);
            fetchAlertas(); // Recargar alertas para que desaparezca la que se marcó
        } catch (err) {
            console.error("Error al marcar alerta como leída:", err);
            // Notificar al usuario
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 animate-fade-in font-inter">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                📚 Educación Financiera 🦉
            </h1>

            {/* Sección de Consejos Financieros */}
            <section className="mb-12 bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    Consejos para el Éxito Financiero <span className="text-yellow-500">✨</span>
                </h2>
                
                {/* Filtros de Consejos */}
                <div className="flex flex-wrap gap-4 mb-8 items-center justify-center md:justify-start">
                    <div>
                        <label htmlFor="publicoFilter" className="block text-sm font-medium text-gray-700 mb-1">Público:</label>
                        <select
                            id="publicoFilter"
                            value={filterPublico}
                            onChange={(e) => setFilterPublico(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                        >
                            <option value="general">General</option>
                            <option value="universitario">Universitario</option>
                            <option value="ahorro">Ahorro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dificultadFilter" className="block text-sm font-medium text-gray-700 mb-1">Dificultad:</label>
                        <select
                            id="dificultadFilter"
                            value={filterDificultad}
                            onChange={(e) => setFilterDificultad(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                        >
                            <option value="básico">Básico</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                        </select>
                    </div>
                </div>

                {isLoadingConsejos ? (
                    <p className="text-center text-gray-600 text-lg animate-pulse">Cargando consejos... 📖</p>
                ) : errorConsejos ? (
                    <p className="text-center text-red-600 text-lg">{errorConsejos}</p>
                ) : consejos.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No hay consejos disponibles con los filtros seleccionados.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {consejos.map(consejo => (
                            <ConsejoCard key={consejo.id} consejo={consejo} onVote={handleVote} />
                        ))}
                    </div>
                )}
            </section>

            {/* Sección de Alertas Inteligentes */}
            <section className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                    Mis Alertas Inteligentes 🔔
                    <button 
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold rounded-lg shadow-md
                                   hover:from-blue-600 hover:to-sky-700 transition-all duration-300 ease-in-out
                                   transform hover:-translate-y-0.5 hover:shadow-lg"
                        onClick={() => setShowCreateAlertaModal(true)}
                    >
                        + Crear Alerta
                    </button>
                </h2>

                {isLoadingAlertas ? (
                    <p className="text-center text-gray-600 text-lg animate-pulse">Cargando tus alertas... ⏳</p>
                ) : errorAlertas ? (
                    <p className="text-center text-red-600 text-lg">{errorAlertas}</p>
                ) : alertas.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No tienes alertas activas. ¡Crea una para mantenerte al tanto!</p>
                ) : (
                    <div className="space-y-4">
                        {alertas.map(alerta => (
                            <AlertaItem key={alerta.id} alerta={alerta} onMarkAsRead={handleMarkAlertaAsRead} />
                        ))}
                    </div>
                )}
            </section>

            {/* Modal para Crear Alerta */}
            <CreateAlertaModal
                isOpen={showCreateAlertaModal}
                onClose={() => setShowCreateAlertaModal(false)}
                onCreateSuccess={fetchAlertas}
            />
        </div>
    );
};

export default EducacionFinancieraPage;
