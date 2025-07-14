// src/api/consejos.js
import axios from 'axios';

const API_URL = 'http://localhost:3006/api/v1/consejos'; // Asegúrate de que esta URL base sea correcta

// Modificado: Ahora acepta un objeto 'filters' para pasar como parámetros de consulta
export const getConsejos = async (filters = {}) => {
    const token = localStorage.getItem('token'); // Obtener el token
    try {
        const response = await axios.get(API_URL, {
            params: filters, // Axios automáticamente serializará 'filters' a query parameters
            headers: {
                Authorization: `Bearer ${token}` // Incluir el token en los headers
            }
        });
        return response; // Axios devuelve el objeto de respuesta, el data estará en response.data
    } catch (error) {
        console.error("Error fetching consejos:", error);
        throw error; // Propagar el error para que el componente pueda manejarlo
    }
};

// Se asume que el token de autenticación se envía en los interceptores de Axios
// o que el backend maneja la autenticación de otra manera para esta ruta.
export const voteConsejo = async (id, voto) => {
    const token = localStorage.getItem('token'); // Asumiendo que el token está en localStorage
    try {
        const response = await axios.post(`${API_URL}/${id}/votar`, { voto }, { // Asegúrate de que el backend espera { voto: 'positivo' } o { voto: 'negativo' }
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Error voting consejo:", error);
        throw error;
    }
};
