// src/api/alertas.js
import axios from 'axios';

// Define la URL base para las alertas. Ajusta esto si tu backend usa una ruta diferente.
const API_URL = 'http://localhost:3006/api/v1/alertas'; // Asegúrate de que esta URL coincida con tu backend

// Función para crear una nueva alerta
export const createAlerta = async (alertaData) => {
    const token = localStorage.getItem('token');
    return await axios.post(API_URL, alertaData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Función para obtener las alertas activas del usuario
// Modificado: Ahora incluye el token de autenticación
export const obtenerAlertasActivas = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching active alerts:", error);
        throw error;
    }
};

// Función para marcar una alerta como leída (inactiva)
export const marcarComoLeida = async (alertaId) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/${alertaId}/marcar-leida`, {}, { // Envía un cuerpo vacío si no se necesitan datos en el PUT
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
