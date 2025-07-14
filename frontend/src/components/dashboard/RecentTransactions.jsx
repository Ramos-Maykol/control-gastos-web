// src/components/dashboard/RecentTransactions.jsx
import React from 'react';

// Este componente ya no necesita importar un archivo CSS.
// Todos los estilos se manejan con clases de Tailwind CSS.

const RecentTransactions = ({ transactions, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-600">
                Cargando transacciones...
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-600 py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay transacciones todavía 😔</h3>
                <p className="text-gray-500">¡Añade tu primer ingreso o gasto para empezar a ver tu historial!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Transacciones Recientes</h2>
            <div className="overflow-x-auto"> {/* Permite el scroll horizontal en pantallas pequeñas */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                                Descripción
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                                Monto
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {tx.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: tx.colorFondo, // Usamos los colores dinámicos del backend
                                            color: tx.colorTexto,
                                        }}
                                    >
                                        {tx.categoria}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tx.fecha}
                                </td>
                                <td className={`
                                    px-6 py-4 whitespace-nowrap text-sm font-semibold text-right
                                    ${tx.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}
                                `}>
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
