// src/api/movimientos.js
import API from './axiosInstance';

// Obtener todos los movimientos
export const getMovimientos = async () => {
  const res = await API.get('/movimientos');
  return res.data; // ✅ Retorna solo los datos
};

// Crear un nuevo movimiento
export const crearMovimiento = async (movimiento) => {
  const res = await API.post('/movimientos', movimiento);
  return res.data;
};

// Actualizar un movimiento por ID
export const actualizarMovimiento = async (id, data) => {
  const res = await API.put(`/movimientos/${id}`, data);
  return res.data;
};

// Eliminar un movimiento por ID
export const eliminarMovimiento = async (id) => {
  const res = await API.delete(`/movimientos/${id}`);
  return res.data;
};
