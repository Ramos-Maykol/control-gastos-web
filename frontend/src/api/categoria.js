import API from './axiosInstance';

export const getCategorias = () => API.get('/categorias');
export const crearCategoria = (data) => API.post('/categorias', data);
export const actualizarCategoria = (id, data) => API.put(`/categorias/${id}`, data);
export const eliminarCategoria = (id) => API.delete(`/categorias/${id}`);
