import axios from 'axios';

const API_URL = '/api/v1/auth';

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const register = (data) => axios.post(`${API_URL}/register`, data);
export const logout = () => axios.post(`${API_URL}/logout`);
export const getUserProfile = () => axios.get(`${API_URL}/me`);