import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import { getMovimientos } from "../../api/movimientos";
import './Dashboard.css';

// --- Iconos ---
import { FaPlus, FaMinus } from 'react-icons/fa';

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
    const ahorroCalc = ingresosTotal > 0 ? ((balanceTotal / ingresosTotal) * 100) : 0;

    return {
        ingresos: ingresosTotal.toFixed(2),
        gastos: gastosTotal.toFixed(2),
        balance: balanceTotal.toFixed(2),
        ahorro: ahorroCalc.toFixed(1)
    };
  }, [transactions]);

  return (
    <main className="main-content">
      <div className="dashboard-layout">
        
        {/* --- COLUMNA IZQUIERDA (PRINCIPAL) --- */}
        <div className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1>Hola, ¡Bienvenido! 👋</h1>
              <p>Este es tu resumen financiero del mes.</p>
            </div>
            <div className="quick-actions">
              <button className="action-btn btn-primary" onClick={() => navigate('/movimientos/nuevo?tipo=ingreso')}>
                <FaPlus /> Nuevo Ingreso
              </button>
              <button className="action-btn btn-secondary" onClick={() => navigate('/movimientos/nuevo?tipo=egreso')}>
                <FaMinus /> Nuevo Gasto
              </button>
            </div>
          </div>
          <RecentTransactions transactions={transactions} isLoading={isLoading} />
        </div>

        {/* --- COLUMNA DERECHA (INDICADORES) --- */}
        <aside className="dashboard-sidebar">
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