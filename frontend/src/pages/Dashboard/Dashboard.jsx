import React, { useEffect, useState } from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import { getMovimientos } from "../../api/movimientos";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getMovimientos();
        // Mapea los datos para que sean compatibles con tu componente
        const formateados = data.map(mov => ({
          fecha: new Date(mov.fecha).toLocaleDateString('es-PE', {
            day: '2-digit', month: 'short'
          }),
          descripcion: mov.descripcion,
          categoria: mov.Categoria?.nombre || "Sin categoría",
          tipo: mov.tipo,
          monto: mov.monto,
          colorFondo: mov.tipo === "income" ? "#d4f8e8" : "#ffe4e6",
          colorTexto: mov.tipo === "income" ? "#00a86b" : "#ff4757",
          icono: mov.tipo === "income" ? "💵" : "💸"
        }));
        setTransactions(formateados);
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      }
    };

    cargarDatos();
  }, []);

  const ingresos = transactions
    .filter(t => t.tipo === "income")
    .reduce((acc, t) => acc + t.monto, 0);

  const gastos = transactions
    .filter(t => t.tipo === "expense")
    .reduce((acc, t) => acc + t.monto, 0);

  const balance = ingresos - gastos;
  const ahorro = ingresos ? ((balance / ingresos) * 100).toFixed(1) : 0;

  return (
    <main className="main-content">
      <div className="welcome-section">
        <h1>Dashboard Financiero</h1>
        <p>Aquí está tu resumen financiero actual</p>
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
        <StatsCard title="Ingresos del Mes" value={`S/. ${ingresos}`} icon="📈" type="income" />
        <StatsCard title="Gastos del Mes" value={`S/. ${gastos}`} icon="📉" type="expense" />
        <StatsCard title="Balance" value={`S/. ${balance}`} icon="💰" type="balance" />
        <StatsCard title="Tasa de Ahorro" value={`${ahorro}%`} icon="🎯" type="savings" />
      </div>

      <RecentTransactions transactions={transactions} />
    </main>
  );
};

export default Dashboard;
