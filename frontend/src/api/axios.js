import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Usará el valor del .env.production
  withCredentials: true, // solo si usas cookies
});

export default api;
