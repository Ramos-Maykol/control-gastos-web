import axios from 'axios';

const API_URL = '/api/v1/metas';

export const getMetas = () => axios.get(API_URL);
export const createMeta = (data) => axios.post(API_URL, data);
export const updateMeta = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteMeta = (id) => axios.delete(`${API_URL}/${id}`);