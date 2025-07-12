import React from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentTransactions from '../../components/dashboard/RecentTransactions';

const Dashboard = () => {
    const stats = [
        { title: 'Ingresos del Mes', value: 'S/. 1,500', icon: '📈', type: 'income' },
        { title: 'Gastos del Mes', value: 'S/. 980', icon: '📉', type: 'expense' },
        { title: 'Balance', value: 'S/. 520', icon: '💰', type: 'balance' },
        { title: 'Tasa de Ahorro', value: '34.7%', icon: '🎯', type: 'savings' },
    ];

    const transactions = [
        {
            fecha: '11 Jul',
            descripcion: 'Mesada mensual',
            categoria: 'Mesada',
            tipo: 'ingreso',
            monto: 500,
            bg: '#d4f8e8',
            color: '#00a86b',
            icon: '💵',
        },
        {
            fecha: '10 Jul',
            descripcion: 'Almuerzo universitario',
            categoria: 'Alimentación',
            tipo: 'egreso',
            monto: 15,
            bg: '#ffe4e6',
            color: '#ff4757',
            icon: '🍕',
        },
        {
            fecha: '09 Jul',
            descripcion: 'Pasaje bus',
            categoria: 'Transporte',
            tipo: 'egreso',
            monto: 5,
            bg: '#e3f2fd',
            color: '#2196f3',
            icon: '🚌',
        },
        {
            fecha: '08 Jul',
            descripcion: 'Libros de estudio',
            categoria: 'Educación',
            tipo: 'egreso',
            monto: 120,
            bg: '#f3e5f5',
            color: '#9c27b0',
            icon: '📚',
        },
    ];

    return (
        <>
            <Header />
            <div className="container">
                <Sidebar />
                <main className="main-content">
                    <div className="welcome-section">
                        <h1>Dashboard Financiero</h1>
                        <p>Aquí está tu resumen financiero del mes de Julio 2025</p>
                    </div>

                    <div className="quick-actions">
                        <button className="action-btn btn-primary">
                            <span>➕</span>
                            <span>Nuevo Ingreso</span>
                        </button>
                        <button className="action-btn btn-secondary">
                            <span>➖</span>
                            <span>Nuevo Gasto</span>
                        </button>
                    </div>

                    <div className="stats-grid">
                        {stats.map((s, idx) => (
                            <StatsCard key={idx} {...s} />
                        ))}
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h2>Tendencia Mensual</h2>
                                <select>
                                    <option>Últimos 6 meses</option>
                                    <option>Último año</option>
                                </select>
                            </div>
                            <div className="chart-placeholder">
                                📊 Gráfico de líneas mostrando ingresos vs gastos
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h2>Gastos por Categoría</h2>
                            </div>
                            <div className="chart-placeholder">
                                🍕 Gráfico circular de gastos
                            </div>
                        </div>
                    </div>

                    <RecentTransactions transactions={transactions} />
                </main>
            </div>
        </>
    );
};

export default Dashboard;
