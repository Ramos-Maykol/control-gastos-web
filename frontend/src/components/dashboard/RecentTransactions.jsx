import React from 'react';
import './RecentTransactions.css';

const RecentTransactions = ({ transactions }) => {
  const safeTransactions = transactions || [];

  return (
    <div className="transactions-table">
      {/* ... */}
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {safeTransactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.fecha}</td>
              <td>{tx.descripcion}</td>
              <td>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor: tx.colorFondo,
                    color: tx.colorTexto,
                  }}
                >
                  {tx.icono} {tx.categoria}
                </span>
              </td>
              <td className={`amount ${tx.tipo}`}>
                {tx.tipo === "income" ? "+" : "-"}S/. {tx.monto}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
