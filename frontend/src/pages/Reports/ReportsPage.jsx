// src/pages/Reports/ReportsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getMovimientos } from '../../api/movimientos';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './ReportsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ReportsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await getMovimientos();
                console.log('RAW API Response for movements:', response); // Keep this log

                const data = response.data || response;

                const validatedData = data.filter(mov => {
                    // Check if date can be parsed
                    const isValidDate = mov && mov.fecha && !isNaN(new Date(mov.fecha).getTime());
                    // Check if monto is a number OR a string that can be parsed to a number
                    const isValidMonto = mov && (typeof mov.monto === 'number' || (!isNaN(parseFloat(mov.monto)) && isFinite(parseFloat(mov.monto))));
                    
                    // console.log(`Validation for mov: ${JSON.stringify(mov)}`);
                    // console.log(`  isValidDate: ${isValidDate}`);
                    // console.log(`  isValidMonto: ${isValidMonto} (Type: ${typeof mov.monto}, Value: ${mov.monto})`);
                    // console.log(`  mov.tipo: ${mov.tipo}`);

                    return mov && isValidDate && mov.tipo && isValidMonto;
                }).map(mov => ({
                    ...mov,
                    monto: parseFloat(mov.monto) // Convert monto to a float immediately if it passes validation
                }));

                console.log('Validated Data for reports:', validatedData); // Keep this log

                setTransactions(validatedData);
            } catch (error) {
                console.error("Error al cargar movimientos para reportes:", error);
                // Handle error, maybe show a message to the user
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
            // This log should reveal issues with mov.fecha parsing or month/year comparison
            console.log(`Checking movement date: ${mov.fecha} (Parsed: ${movDate}), Selected Period: Month ${selectedMonth}, Year ${selectedYear}, Match: ${movDate.getMonth() === selectedMonth && movDate.getFullYear() === selectedYear}`);
            return movDate.getMonth() === selectedMonth && movDate.getFullYear() === selectedYear;
        });

        currentMonthData.forEach(mov => {
            const monthKey = new Date(mov.fecha).toLocaleString('es-PE', { month: 'short', year: 'numeric' });
            // Asegúrate de que mov.categoria exista antes de intentar acceder a mov.categoria.nombre
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

        console.log('Filtered Transactions for charts (current period):', currentMonthData);
        console.log('Aggregated Income:', Array.from(incomeMap.entries()));
        console.log('Aggregated Expenses:', Array.from(expenseMap.entries()));
        console.log('Aggregated Categories:', Array.from(categoryMap.entries()));

        return {
            incomeByMonth: Array.from(incomeMap.entries()).map(([month, amount]) => ({ month, amount })),
            expenseByMonth: Array.from(expenseMap.entries()).map(([month, amount]) => ({ month, amount })),
            categoriesByMonth: Array.from(categoryMap.entries()).map(([category, amount]) => ({ category, amount })),
            filteredTransactionsForPeriod: currentMonthData // Expose this for conditional rendering
        };
    }, [transactions, selectedMonth, selectedYear]);

    const chartData = {
        labels: ['Ingresos', 'Gastos'],
        datasets: [
            {
                label: `Monto (${new Date(selectedYear, selectedMonth).toLocaleString('es-PE', { month: 'long', year: 'numeric' })})`,
                data: [
                    incomeByMonth.reduce((sum, item) => sum + item.amount, 0),
                    expenseByMonth.reduce((sum, item) => sum + item.amount, 0)
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const categoryChartData = {
        labels: categoriesByMonth.map(item => item.category),
        datasets: [
            {
                label: 'Gastos por Categoría',
                data: categoriesByMonth.map(item => item.amount),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#1E88E5', '#D81B60', '#FFD54F', '#004D40'
                ],
                hoverOffset: 4
            }
        ]
    };

    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setSelectedMonth(month - 1);
        setSelectedYear(year);
    };

    const getAvailableMonths = () => {
        const uniqueDates = new Set();
        transactions.forEach(mov => {
            const date = new Date(mov.fecha);
            // Only add valid dates to the selector
            if (!isNaN(date.getTime())) {
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

        // Ensure current month is always an option if there are no transactions for it yet
        const currentMonthYear = `${new Date().getFullYear()}-${new Date().getMonth()}`;
        if (!uniqueDates.has(currentMonthYear)) {
            sortedDates.push({ year: new Date().getFullYear(), month: new Date().getMonth() });
            // Re-sort to maintain order if current month was added
            sortedDates.sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.month - b.month;
            });
        }

        return sortedDates;
    };


    if (isLoading) {
        return <div className="reports-container"><p>Cargando reportes...</p></div>;
    }

    return (
        <div className="reports-container">
            <h1 className="reports-title">Reportes Financieros</h1>

            <div className="reports-controls">
                <label htmlFor="month-select">Seleccionar Mes:</label>
                <select id="month-select" onChange={handleMonthChange} value={`${selectedYear}-${selectedMonth + 1}`}>
                    {getAvailableMonths().map(({ year, month }) => (
                        <option key={`${year}-${month}`} value={`${year}-${month + 1}`}>
                            {new Date(year, month).toLocaleString('es-PE', { month: 'long', year: 'numeric' })}
                        </option>
                    ))}
                </select>
            </div>

            {/* MODIFICADO: Usa filteredTransactionsForPeriod para la condición */}
            {filteredTransactionsForPeriod.length === 0 ? (
                <p>No hay datos de movimientos para generar reportes en este período seleccionado.</p>
            ) : (
                <div className="reports-grid">
                    <div className="chart-card">
                        <h2>Ingresos vs. Gastos</h2>
                        <div className="chart-wrapper">
                             <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Comparativa de Ingresos y Gastos'
                                        },
                                        legend: {
                                            display: false
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: 'Monto (S/)'
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h2>Gastos por Categoría</h2>
                        <div className="chart-wrapper">
                            {categoriesByMonth.length > 0 ? (
                                <Bar
                                    data={categoryChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Distribución de Gastos por Categoría'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Monto (S/)'
                                                }
                                            },
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Categoría'
                                                }
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <p>No hay gastos registrados en este período para mostrar por categoría.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;