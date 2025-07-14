// controllers/alertaController.js
// Cambiamos a sintaxis de importación de módulos ES
import db from '../models/index.js'; // Asumiendo que tu index.js de modelos exporta 'db'
const { Alerta, Usuario } = db; // Asegúrate de que Usuario también esté disponible si lo necesitas
import { Op } from 'sequelize'; // Importa Op para operadores de Sequelize

export const obtenerAlertasActivas = async (req, res, next) => {
    try {
        // req.usuario.id viene del middleware de autenticación
        const alertas = await Alerta.findAll({
            where: { 
                usuario_id: req.usuario.id,
                activa: true,
                // [Op.lte] significa "less than or equal to" (menor o igual a)
                // Esto asegura que solo se obtengan alertas cuya fecha_alerta sea hoy o en el pasado
                fecha_alerta: { [Op.lte]: new Date() } 
            },
            order: [['fecha_alerta', 'DESC']]
        });
        
        res.json(alertas);
    } catch (error) {
        console.error("Error al obtener alertas activas:", error);
        next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
};

export const marcarComoLeida = async (req, res, next) => {
    try {
        const alerta = await Alerta.findOne({
            where: { id: req.params.id, usuario_id: req.usuario.id }
        });
        
        if (!alerta) {
            return res.status(404).json({ error: 'Alerta no encontrada o no pertenece a este usuario' });
        }

        await alerta.update({ activa: false });
        res.status(204).end(); // 204 No Content para una actualización exitosa sin contenido de respuesta
    } catch (error) {
        console.error("Error al marcar alerta como leída:", error);
        next(error);
    }
};

export const crearAlerta = async (req, res, next) => {
    try {
        const { mensaje, tipo_alerta, fecha_alerta, parametros } = req.body;

        // Validaciones básicas de entrada
        if (!mensaje || !tipo_alerta || !fecha_alerta) {
            return res.status(400).json({ error: 'Mensaje, tipo de alerta y fecha son campos obligatorios.' });
        }
        
        // req.usuario.id viene del middleware de autenticación
        const nuevaAlerta = await Alerta.create({
            usuario_id: req.usuario.id,
            mensaje,
            tipo_alerta,
            fecha_alerta,
            parametros: parametros || {} // Asegura que 'parametros' sea un objeto, incluso si es null/undefined
        });
        
        res.status(201).json(nuevaAlerta); // 201 Created para una creación exitosa
    } catch (error) {
        console.error("Error al crear alerta:", error);
        next(error);
    }
};

// No usamos module.exports si estamos usando export const
// module.exports = { obtenerAlertasActivas, marcarComoLeida, crearAlerta };
