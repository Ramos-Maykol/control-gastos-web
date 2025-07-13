import React, { useState, useEffect } from 'react';
import { crearMovimiento } from '../../api/movimientos';
import { getCategorias } from '../../api/categoria';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CreateMovimiento.css';

const CreateMovimiento = () => {
  const [searchParams] = useSearchParams();
  const tipoInicial = searchParams.get('tipo') === 'egreso' ? 'egreso' : 'ingreso';

  const [tipo, setTipo] = useState(tipoInicial);
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [categoria_id, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await getCategorias();
        setCategorias(res.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar categorías');
      }
    };
    cargarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearMovimiento({
        tipo,
        monto: parseFloat(monto),
        fecha,
        descripcion,
        categoria_id
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Error al crear movimiento');
    }
  };

  return (
    <div className={`form-movimiento-container ${tipo}`}>
      <div className="form-card">
        <h2>{tipo === 'egreso' ? '➖ Nuevo Gasto' : '➕ Nuevo Ingreso'}</h2>

        <form onSubmit={handleSubmit} className="form-movimiento">
          <div className="form-group">
            <label>Tipo:</label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setCategoriaId('');
              }}
            >
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monto:</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select
              value={categoria_id}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">-- Selecciona --</option>
              {categorias
                .filter(cat => cat.tipo === tipo)
                .map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit" className="btn-save">
            Guardar Movimiento
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default CreateMovimiento;
