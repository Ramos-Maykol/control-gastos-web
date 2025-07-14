// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard"; // Importa el nuevo componente
import RecentTransactions from "../../components/dashboard/RecentTransactions"; // Importa el nuevo componente
import { getMovimientos } from "../../api/movimientos";
// No necesitamos importar Dashboard.css, todo se manejará con Tailwind CSS.

// --- Iconos ---
import { FaPlus, FaMinus } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado: npm install react-icons

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            setIsLoading(true);
            try {
                const response = await getMovimientos();
                const data = response.data || response;

                const formateados = data.map(mov => ({
                    id: mov.id,
                    fecha: new Date(mov.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
                    descripcion: mov.descripcion,
                    categoria: mov.categoria?.nombre || "Sin categoría",
                    tipo: mov.tipo,
                    monto: Number(mov.monto),
                    // Colores de fondo y texto para las insignias de categoría, consistentes con los StatCards
                    colorFondo: mov.tipo === "ingreso" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    colorTexto: mov.tipo === "ingreso" ? "#16a34a" : "#ef4444",
                }));

                setTransactions(formateados);
            } catch (error) {
                console.error("Error al cargar movimientos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const { ingresos, gastos, balance, ahorro } = useMemo(() => {
        const ingresosTotal = transactions
            .filter(t => t.tipo === "ingreso")
            .reduce((acc, t) => acc + t.monto, 0);

        const gastosTotal = transactions
            .filter(t => t.tipo === "egreso")
            .reduce((acc, t) => acc + t.monto, 0);

        const balanceTotal = ingresosTotal - gastosTotal;
        // Calcula la tasa de ahorro solo si hay ingresos para evitar división por cero
        const ahorroCalc = ingresosTotal > 0 ? ((balanceTotal / ingresosTotal) * 100) : 0;

        return {
            ingresos: ingresosTotal.toFixed(2),
            gastos: gastosTotal.toFixed(2),
            balance: balanceTotal.toFixed(2),
            ahorro: ahorroCalc.toFixed(1)
        };
    }, [transactions]);

    return (
        <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 animate-fade-in font-inter">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* --- COLUMNA PRINCIPAL (IZQUIERDA EN ESCRITORIO) --- */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Cabecera del Dashboard */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                            Hola, ¡Bienvenido! 👋
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Este es tu resumen financiero del mes. ¡Mantén el control!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                                           bg-indigo-600 text-white font-semibold text-lg shadow-md
                                           hover:bg-indigo-700 transition-all duration-300 ease-in-out
                                           transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                                onClick={() => navigate('/movimientos/nuevo?tipo=ingreso')}
                            >
                                <FaPlus className="text-lg" /> Nuevo Ingreso
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                                           bg-purple-600 text-white font-semibold text-lg shadow-md
                                           hover:bg-purple-700 transition-all duration-300 ease-in-out
                                           transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                                onClick={() => navigate('/movimientos/nuevo?tipo=egreso')}
                            >
                                <FaMinus className="text-lg" /> Nuevo Gasto
                            </button>
                        </div>
                    </div>

                    {/* Sección de Transacciones Recientes */}
                    <RecentTransactions transactions={transactions} isLoading={isLoading} />
                </div>

                {/* --- COLUMNA DE INDICADORES (DERECHA EN ESCRITORIO, ARRIBA EN MÓVIL) --- */}
                <aside className="lg:col-span-1 flex flex-col gap-6
                                  md:grid md:grid-cols-2 lg:flex lg:flex-col lg:sticky lg:top-8">
                    <StatsCard title="Ingresos del Mes" value={`S/ ${ingresos}`} icon="📈" type="income" />
                    <StatsCard title="Gastos del Mes" value={`S/ ${gastos}`} icon="📉" type="expense" />
                    <StatsCard title="Balance Total" value={`S/ ${balance}`} icon="💰" type="balance" />
                    <StatsCard title="Tasa de Ahorro" value={`${ahorro}%`} icon="🎯" type="savings" />
                </aside>

            </div>
        </main>
    );
};

export default Dashboard;
