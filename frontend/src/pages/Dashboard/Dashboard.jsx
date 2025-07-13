import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import { getMovimientos } from "../../api/movimientos";
import './Dashboard.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await getMovimientos();
        const data = response.data || response;  // maneja ambos casos
        const formateados = data.map(mov => ({
          fecha: new Date(mov.fecha).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short'
          }),
          descripcion: mov.descripcion,
          categoria: mov.categoria?.nombre || "Sin categoría", // ← corregido
          tipo: mov.tipo,
          monto: Number(mov.monto), // ← aseguramos que es número
          colorFondo: mov.tipo === "ingreso" ? "#d4f8e8" : "#ffe4e6",
          colorTexto: mov.tipo === "ingreso" ? "#00a86b" : "#ff4757",
          icono: mov.tipo === "ingreso" ? "💵" : "💸"
        }));
        setTransactions(formateados);
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      }
    };

    cargarDatos();
  }, []);

  // Totales
  const ingresos = transactions
    .filter(t => t.tipo === "ingreso")
    .reduce((acc, t) => acc + t.monto, 0);

  const gastos = transactions
    .filter(t => t.tipo === "egreso")
    .reduce((acc, t) => acc + t.monto, 0);

  const balance = ingresos - gastos;
  const ahorro = ingresos ? ((balance / ingresos) * 100).toFixed(1) : 0;

  return (
    <main className="main-content">
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Dashboard Financiero</h1>
          <p>Resumen financiero actualizado</p>
        </div>

        <div className="quick-actions">
          <button
            className="action-btn btn-primary"
            onClick={() => navigate('/movimientos/nuevo?tipo=ingreso')}
          >
            <span>➕</span> Nuevo Ingreso
          </button>
          <button
            className="action-btn btn-secondary"
            onClick={() => navigate('/movimientos/nuevo?tipo=egreso')}
          >
            <span>➖</span> Nuevo Gasto
          </button>
        </div>

        <div className="stats-grid">
          <StatsCard title="Ingresos del Mes" value={`S/. ${ingresos.toFixed(2)}`} icon="📈" type="income" />
          <StatsCard title="Gastos del Mes" value={`S/. ${gastos.toFixed(2)}`} icon="📉" type="expense" />
          <StatsCard title="Balance" value={`S/. ${balance.toFixed(2)}`} icon="💰" type="balance" />
          <StatsCard title="Tasa de Ahorro" value={`${ahorro}%`} icon="🎯" type="savings" />
        </div>

        <RecentTransactions transactions={transactions} />
      </div>
    </main>
  );
};

export default Dashboard;
