import axios from 'axios';

const API_URL = '/api/v1/movimientos';

export const getMovimientos = () => axios.get(API_URL);
export const createMovimiento = (data) => axios.post(API_URL, data);
export const deleteMovimiento = (id) => axios.delete(`${API_URL}/${id}`);
