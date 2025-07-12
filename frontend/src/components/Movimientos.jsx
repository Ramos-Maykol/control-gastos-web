import { useQuery } from '@tanstack/react-query';
import { getMovimientos } from '../api/movimientos';

const MovimientosList = ({ usuarioId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['movimientos', usuarioId],
    queryFn: () => getMovimientos(usuarioId),
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Historial de Movimientos</h2>
      <div className="space-y-3">
        {data.map((movimiento) => (
          <div 
            key={movimiento.id}
            className={`p-4 rounded-lg ${movimiento.tipo === 'ingreso' 
              ? 'bg-green-100' 
              : 'bg-red-100'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{movimiento.descripcion}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(movimiento.fecha).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg font-medium">
                {movimiento.tipo === 'ingreso' ? '+' : '-'} 
                S/ {movimiento.monto.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
