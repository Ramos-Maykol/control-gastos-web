import axios from 'axios';

// ✅ Instancia base
const API = axios.create({
  baseURL: 'http://localhost:3006/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor para incluir token en cada solicitud
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// ✅ Interceptor de respuesta para manejar errores globales
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Si el token es inválido o ha expirado, redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Obtener movimientos
export const getMovimientos = async () => {
  try {
    const response = await API.get('/movimientos');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener movimientos');
  }
};

// ✅ Agregar movimiento
export const addMovimiento = async (movimiento) => {
  try {
    const response = await API.post('/movimientos', movimiento);
    return response.data;
  } catch (error) {
    throw new Error('Error al agregar movimiento');
  }
};

export default API;
