import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3006/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para JWT
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovimientos = async (usuarioId) => {
  try {
    const response = await API.get(`/movimientos/${usuarioId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener movimientos');
  }
};

export const addMovimiento = async (movimiento) => {
  try {
    const response = await API.post('/movimientos', movimiento);
    return response.data;
  } catch (error) {
    throw new Error('Error al agregar movimiento');
  }
};
