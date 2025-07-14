import React from 'react';
import './RecentTransactions.css';

const RecentTransactions = ({ transactions, isLoading }) => {
  if (isLoading) {
    return <div className="transactions-container">Cargando transacciones...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="transactions-container empty-state">
        <h3>No hay transacciones todavía</h3>
        <p>¡Añade tu primer ingreso o gasto para empezar!</p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Transacciones Recientes</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th className="amount-header">Monto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.descripcion}</td>
                <td>
                  <span
                    className="category-badge"
                    style={{
                      backgroundColor: tx.colorFondo,
                      color: tx.colorTexto,
                    }}
                  >
                    {tx.categoria}
                  </span>
                </td>
                <td>{tx.fecha}</td>
                <td className={`amount ${tx.tipo === 'ingreso' ? 'income-amount' : 'expense-amount'}`}>
                  {tx.tipo === 'ingreso' ? '+' : '-'} S/ {tx.monto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(RecentTransactions);