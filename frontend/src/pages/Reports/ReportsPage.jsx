// src/pages/Reports/ReportsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getMovimientos } from '../../api/movimientos';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// Ya no necesitamos importar ReportsPage.css, todo se manejará con Tailwind CSS.

// Registra los componentes de Chart.js necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ReportsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Establece el mes y año iniciales al mes y año actuales
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await getMovimientos();
                // console.log('RAW API Response for movements:', response); // Mantener para depuración si es necesario

                const data = response.data || response;

                const validatedData = data.filter(mov => {
                    // Validar que la fecha pueda ser parseada
                    const isValidDate = mov && mov.fecha && !isNaN(new Date(mov.fecha).getTime());
                    // Validar que el monto sea un número o una cadena que pueda ser parseada a número
                    const isValidMonto = mov && (typeof mov.monto === 'number' || (!isNaN(parseFloat(mov.monto)) && isFinite(parseFloat(mov.monto))));
                    
                    return mov && isValidDate && mov.tipo && isValidMonto;
                }).map(mov => ({
                    ...mov,
                    monto: parseFloat(mov.monto) // Convertir monto a float inmediatamente si pasa la validación
                }));

                // console.log('Validated Data for reports:', validatedData); // Mantener para depuración si es necesario

                setTransactions(validatedData);
            } catch (error) {
                console.error("Error al cargar movimientos para reportes:", error);
                // Aquí podrías mostrar un mensaje de error al usuario en la UI
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const { incomeByMonth, expenseByMonth, categoriesByMonth, filteredTransactionsForPeriod } = useMemo(() => {
        const incomeMap = new Map();
        const expenseMap = new Map();
        const categoryMap = new Map();

        const currentMonthData = transactions.filter(mov => {
            const movDate = new Date(mov.fecha);
            return movDate.getMonth() === selectedMonth && movDate.getFullYear() === selectedYear;
        });

        currentMonthData.forEach(mov => {
            const monthKey = new Date(mov.fecha).toLocaleString('es-PE', { month: 'short', year: 'numeric' });
            const categoryName = mov.categoria && mov.categoria.nombre ? mov.categoria.nombre : 'Sin Categoría';

            if (mov.tipo === 'ingreso') {
                incomeMap.set(monthKey, (incomeMap.get(monthKey) || 0) + mov.monto);
            } else if (mov.tipo === 'egreso') {
                expenseMap.set(monthKey, (expenseMap.get(monthKey) || 0) + mov.monto);

                if (!categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, 0);
                }
                categoryMap.set(categoryName, categoryMap.get(categoryName) + mov.monto);
            }
        });

        // console.log('Filtered Transactions for charts (current period):', currentMonthData); // Depuración
        // console.log('Aggregated Income:', Array.from(incomeMap.entries())); // Depuración
        // console.log('Aggregated Expenses:', Array.from(expenseMap.entries())); // Depuración
        // console.log('Aggregated Categories:', Array.from(categoryMap.entries())); // Depuración

        return {
            incomeByMonth: Array.from(incomeMap.entries()).map(([month, amount]) => ({ month, amount })),
            expenseByMonth: Array.from(expenseMap.entries()).map(([month, amount]) => ({ month, amount })),
            categoriesByMonth: Array.from(categoryMap.entries()).map(([category, amount]) => ({ category, amount })),
            filteredTransactionsForPeriod: currentMonthData // Expone esto para renderizado condicional
        };
    }, [transactions, selectedMonth, selectedYear]);

    // Datos para el gráfico de Ingresos vs. Gastos
    const chartData = {
        labels: ['Ingresos', 'Gastos'],
        datasets: [
            {
                label: `Monto (${new Date(selectedYear, selectedMonth).toLocaleString('es-PE', { month: 'long', year: 'numeric' })})`,
                data: [
                    incomeByMonth.reduce((sum, item) => sum + item.amount, 0),
                    expenseByMonth.reduce((sum, item) => sum + item.amount, 0)
                ],
                backgroundColor: ['#4ade80', '#f87171'], // Colores más vivos de Tailwind (green-400, red-400)
                borderColor: ['#22c55e', '#ef4444'],   // Bordes más oscuros (green-500, red-500)
                borderWidth: 1,
                borderRadius: 8, // Bordes redondeados para las barras
            },
        ],
    };

    // Opciones para el gráfico de Ingresos vs. Gastos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Comparativa de Ingresos y Gastos',
                font: {
                    size: 18,
                    weight: 'bold',
                    family: 'Inter, sans-serif'
                },
                color: '#334155' // text-slate-700
            },
            legend: {
                display: false // No mostrar la leyenda si solo hay una barra por categoría
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 14, family: 'Inter, sans-serif' },
                bodyFont: { size: 12, family: 'Inter, sans-serif' },
                padding: 10,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Monto (S/)',
                    font: { size: 14, family: 'Inter, sans-serif' },
                    color: '#475569' // text-slate-600
                },
                grid: {
                    color: '#e2e8f0' // slate-200
                },
                ticks: {
                    color: '#64748b' // slate-500
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#64748b' // slate-500
                }
            }
        }
    };

    // Datos para el gráfico de Gastos por Categoría
    const categoryChartData = {
        labels: categoriesByMonth.map(item => item.category),
        datasets: [
            {
                label: 'Gastos por Categoría',
                data: categoriesByMonth.map(item => item.amount),
                backgroundColor: [ // Paleta de colores más juvenil y variada
                    '#8b5cf6', // violet-500
                    '#ec4899', // pink-500
                    '#facc15', // yellow-400
                    '#22d3ee', // cyan-400
                    '#a3e635', // lime-400
                    '#f97316', // orange-500
                    '#6b7280', // gray-500
                    '#6366f1', // indigo-500
                    '#ef4444', // red-500
                    '#3b82f6', // blue-500
                ],
                borderColor: '#ffffff', // Borde blanco para las barras
                borderWidth: 1,
                borderRadius: 8, // Bordes redondeados para las barras
                hoverOffset: 4
            }
        ]
    };

    // Opciones para el gráfico de Gastos por Categoría
    const categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Distribución de Gastos por Categoría',
                font: {
                    size: 18,
                    weight: 'bold',
                    family: 'Inter, sans-serif'
                },
                color: '#334155' // text-slate-700
            },
            legend: {
                position: 'top', // Leyenda en la parte superior
                labels: {
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif'
                    },
                    color: '#475569' // text-slate-600
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 14, family: 'Inter, sans-serif' },
                bodyFont: { size: 12, family: 'Inter, sans-serif' },
                padding: 10,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Monto (S/)',
                    font: { size: 14, family: 'Inter, sans-serif' },
                    color: '#475569' // text-slate-600
                },
                grid: {
                    color: '#e2e8f0' // slate-200
                },
                ticks: {
                    color: '#64748b' // slate-500
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Categoría',
                    font: { size: 14, family: 'Inter, sans-serif' },
                    color: '#475569' // text-slate-600
                },
                grid: {
                    display: false
                },
                ticks: {
                    color: '#64748b' // slate-500
                }
            }
        }
    };

    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setSelectedMonth(month - 1); // Resta 1 porque los meses en JS son de 0 a 11
        setSelectedYear(year);
    };

    const getAvailableMonths = () => {
        const uniqueDates = new Set();
        transactions.forEach(mov => {
            const date = new Date(mov.fecha);
            if (!isNaN(date.getTime())) { // Asegúrate de que la fecha sea válida
                uniqueDates.add(`${date.getFullYear()}-${date.getMonth()}`);
            }
        });

        const sortedDates = Array.from(uniqueDates)
            .map(dateStr => {
                const [year, month] = dateStr.split('-').map(Number);
                return { year, month };
            })
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.month - b.month;
            });

        // Asegura que el mes actual siempre sea una opción si no hay transacciones para él aún
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthYearKey = `${currentYear}-${currentMonth}`;
        if (!uniqueDates.has(currentMonthYearKey)) {
            sortedDates.push({ year: currentYear, month: currentMonth });
            // Re-ordenar para mantener el orden si se añadió el mes actual
            sortedDates.sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.month - b.month;
            });
        }

        return sortedDates;
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-inter">
                <p className="text-lg text-gray-600 animate-pulse">Cargando reportes financieros...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 animate-fade-in font-inter">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                📊 Tus Reportes Financieros
            </h1>

            <div className="flex justify-end mb-8">
                <label htmlFor="month-select" className="block text-base font-semibold text-gray-700 mr-3 self-center">
                    Seleccionar Período:
                </label>
                <select
                    id="month-select"
                    onChange={handleMonthChange}
                    value={`${selectedYear}-${selectedMonth + 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                               focus:ring-indigo-500 focus:border-indigo-500
                               transition duration-300 text-gray-800
                               hover:border-indigo-400 appearance-none bg-white pr-8 cursor-pointer"
                >
                    {getAvailableMonths().map(({ year, month }) => (
                        <option key={`${year}-${month}`} value={`${year}-${month + 1}`}>
                            {new Date(year, month).toLocaleString('es-PE', { month: 'long', year: 'numeric' })}
                        </option>
                    ))}
                </select>
            </div>

            {filteredTransactionsForPeriod.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center text-gray-600 py-16">
                    <p className="text-2xl font-semibold text-gray-800 mb-4">
                        ¡Ups! No hay datos de movimientos para este período 😔
                    </p>
                    <p className="text-lg text-gray-500">
                        Intenta seleccionar otro mes o añade algunos ingresos y gastos para generar tus reportes.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tarjeta de Ingresos vs. Gastos */}
                    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingresos vs. Gastos</h2>
                        <div className="w-full h-80"> {/* Altura fija para los gráficos */}
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Tarjeta de Gastos por Categoría */}
                    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gastos por Categoría</h2>
                        <div className="w-full h-80"> {/* Altura fija para los gráficos */}
                            {categoriesByMonth.length > 0 ? (
                                <Bar data={categoryChartData} options={categoryChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>No hay gastos registrados en este período para mostrar por categoría.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
