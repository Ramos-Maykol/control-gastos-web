import axios from 'axios';

const API_URL = '/api/v1/categorias';

export const getCategorias = () => axios.get(API_URL);
export const createCategoria = (data) => axios.post(API_URL, data);
export const deleteCategoria = (id) => axios.delete(`${API_URL}/${id}`);