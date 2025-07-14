// src/api/auth.js
import axios from 'axios';

// URL base para las rutas de autenticación de tu API
const API_URL = '/api/v1/auth'; // Asegúrate de que esta URL base coincida con la configuración de tu backend

/**
 * Realiza una petición de inicio de sesión al backend.
 * @param {object} credentials - Objeto con 'email' y 'password' del usuario.
 * @returns {Promise<object>} La respuesta de la API, que debería contener el token.
 */
export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);

/**
 * Realiza una petición de registro de usuario al backend.
 * @param {object} data - Objeto con los datos del nuevo usuario (ej. nombre, email, password).
 * @returns {Promise<object>} La respuesta de la API.
 */
export const register = (data) => axios.post(`${API_URL}/register`, data);

/**
 * Realiza una petición de cierre de sesión al backend.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const logout = () => axios.post(`${API_URL}/logout`);

/**
 * Obtiene el perfil del usuario autenticado.
 * @returns {Promise<object>} La respuesta de la API con los datos del perfil del usuario.
 */
export const getUserProfile = () => axios.get(`${API_URL}/me`);
