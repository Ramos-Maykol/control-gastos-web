// src/api/metas.js
import API from './axiosInstance';

/**
 * Obtiene todas las metas de ahorro del usuario autenticado.
 * @returns {Promise<Array>} Un array de objetos de meta de ahorro.
 */
export const getMetas = async () => {
    try {
        const res = await API.get('/metas');
        return res.data;
    } catch (error) {
        console.error("Error al obtener metas de ahorro:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Crea una nueva meta de ahorro.
 * @param {object} metaData - Los datos de la nueva meta (titulo, monto_objetivo, fecha_fin, descripcion opcional).
 * @returns {Promise<object>} La meta de ahorro creada.
 */
export const createMeta = async (metaData) => {
    try {
        const res = await API.post('/metas', metaData);
        return res.data;
    } catch (error) {
        console.error("Error al crear meta de ahorro:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza el progreso (monto_actual) de una meta de ahorro específica.
 * @param {number} id - El ID de la meta a actualizar.
 * @param {number} monto - El monto a añadir al monto_actual.
 * @returns {Promise<object>} La meta de ahorro actualizada.
 */
export const updateMetaProgress = async (id, monto) => {
    try {
        const res = await API.put(`/metas/${id}/progreso`, { monto });
        return res.data;
    } catch (error) {
        console.error(`Error al actualizar progreso de la meta ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Puedes añadir funciones para eliminar o editar la meta completa si lo necesitas más adelante
// export const deleteMeta = async (id) => { /* ... */ };
// export const updateMeta = async (id, data) => { /* ... */ };
