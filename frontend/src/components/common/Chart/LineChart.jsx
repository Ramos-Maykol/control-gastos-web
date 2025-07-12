// src/components/common/Chart/LineChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Mar', ingreso: 400, egreso: 240 },
  { name: 'Abr', ingreso: 300, egreso: 139 },
  { name: 'May', ingreso: 200, egreso: 980 },
  { name: 'Jun', ingreso: 278, egreso: 390 },
  { name: 'Jul', ingreso: 189, egreso: 480 },
];

const MonthlyTrendChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tendencia Mensual</h2>
        <select className="border rounded px-2 py-1">
          <option>Últimos 6 meses</option>
          <option>Último año</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ingreso" stroke="#00a86b" strokeWidth={2} />
          <Line type="monotone" dataKey="egreso" stroke="#ff4757" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
