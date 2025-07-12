import axios from 'axios';

const API_URL = '/api/v1/consejos';

export const getConsejos = () => axios.get(API_URL);
export const voteConsejo = (id, tipo) => axios.post(`${API_URL}/${id}/votar`, { tipo });