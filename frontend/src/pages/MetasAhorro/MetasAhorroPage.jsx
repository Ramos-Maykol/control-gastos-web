// src/pages/MetasAhorro/MetasAhorroPage.jsx
import React, { useState, useEffect } from 'react';
import { getMetas } from '../../api/metas';
import GoalCard from '../../components/metas/GoalCard'; // Importa el nuevo componente GoalCard
import CreateGoalModal from '../../components/metas/CreateGoalModal'; // Importa el nuevo componente CreateGoalModal
import UpdateProgressModal from '../../components/metas/UpdateProgressModal'; // Importa el nuevo componente UpdateProgressModal
// Ya no necesitamos importar MetasAhorroPage.css, todo se manejará con Tailwind CSS.

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
            // Podrías mostrar un mensaje de error al usuario en la UI
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
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50 font-inter">
                <p className="text-lg text-gray-600 animate-pulse">Cargando tus metas de ahorro... 🌳</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 animate-fade-in font-inter">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Mis Metas de Ahorro 🐾
            </h1>

            <div className="flex justify-end mb-8">
                <button
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg
                               hover:from-green-600 hover:to-teal-700 transition-all duration-300 ease-in-out
                               transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Crear Nueva Meta 🌿
                </button>
            </div>

            {metas.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-600 py-16">
                    <p className="text-2xl font-semibold text-gray-800 mb-4">
                        ¡Aún no tienes metas de ahorro! 🦉
                    </p>
                    <p className="text-lg text-gray-500">
                        Crea tu primera meta y empieza a construir tu futuro financiero.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
