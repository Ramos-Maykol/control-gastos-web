// src/pages/Dashboard/Dashboard.jsx
import React from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

const Dashboard = () => {
  const transactions = [
    {
      fecha: "11 Jul",
      descripcion: "Mesada mensual",
      categoria: "Mesada",
      tipo: "income",
      monto: 500,
      colorFondo: "#d4f8e8",
      colorTexto: "#00a86b",
      icono: "💵",
    },
    {
      fecha: "10 Jul",
      descripcion: "Almuerzo universitario",
      categoria: "Alimentación",
      tipo: "expense",
      monto: 15,
      colorFondo: "#ffe4e6",
      colorTexto: "#ff4757",
      icono: "🍕",
    },
    {
      fecha: "09 Jul",
      descripcion: "Pasaje bus",
      categoria: "Transporte",
      tipo: "expense",
      monto: 5,
      colorFondo: "#e3f2fd",
      colorTexto: "#2196f3",
      icono: "🚌",
    },
  ];

  return (
    <main className="main-content">
      <div className="welcome-section">
        <h1>Dashboard Financiero</h1>
        <p>Aquí está tu resumen financiero del mes de Julio 2025</p>
      </div>

      <div className="quick-actions">
        <button className="action-btn btn-primary">
          <span>➕</span> Nuevo Ingreso
        </button>
        <button className="action-btn btn-secondary">
          <span>➖</span> Nuevo Gasto
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Ingresos del Mes"
          value="S/. 1,500"
          icon="📈"
          type="income"
        />
        <StatsCard
          title="Gastos del Mes"
          value="S/. 980"
          icon="📉"
          type="expense"
        />
        <StatsCard title="Balance" value="S/. 520" icon="💰" type="balance" />
        <StatsCard
          title="Tasa de Ahorro"
          value="34.7%"
          icon="🎯"
          type="savings"
        />
      </div>

      <RecentTransactions transactions={transactions} />
    </main>
  );
};

export default Dashboard;
