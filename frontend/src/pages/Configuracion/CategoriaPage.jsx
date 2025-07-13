import React, { useEffect, useState } from 'react';
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../api/categoria';
import './CategoriaPage.css'; // ➕ Asegúrate de crear este archivo

const CategoriaPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({ nombre: '', tipo: 'ingreso', es_global: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await actualizarCategoria(editId, formulario);
      } else {
        await crearCategoria(formulario);
      }
      setFormulario({ nombre: '', tipo: 'ingreso', es_global: false });
      setModoEdicion(false);
      setEditId(null);
      cargarCategorias();
    } catch (error) {
      console.error('Error al guardar categoría', error);
    }
  };

  const handleEditar = (categoria) => {
    setFormulario({
      nombre: categoria.nombre,
      tipo: categoria.tipo,
      es_global: categoria.es_global
    });
    setModoEdicion(true);
    setEditId(categoria.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await eliminarCategoria(id);
        cargarCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría', error);
      }
    }
  };

  return (
    <div className="categoria-container">
      <h2>Gestión de Categorías</h2>

      <form className="categoria-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          placeholder="Nombre de la categoría"
          required
        />
        <select name="tipo" value={formulario.tipo} onChange={handleChange}>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="es_global"
            checked={formulario.es_global}
            onChange={handleChange}
          /> Global
        </label>
        <div className="form-buttons">
          <button type="submit" className="btn save-btn">
            {modoEdicion ? 'Actualizar' : 'Crear'}
          </button>
          {modoEdicion && (
            <button type="button" className="btn cancel-btn" onClick={() => {
              setFormulario({ nombre: '', tipo: 'ingreso', es_global: false });
              setModoEdicion(false);
              setEditId(null);
            }}>Cancelar</button>
          )}
        </div>
      </form>

      <table className="categoria-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Global</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.nombre}</td>
              <td>{cat.tipo}</td>
              <td>{cat.es_global ? '✅' : '❌'}</td>
              <td>
                <button className="btn edit-btn" onClick={() => handleEditar(cat)}>✏️</button>
                <button className="btn delete-btn" onClick={() => handleEliminar(cat.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriaPage;
