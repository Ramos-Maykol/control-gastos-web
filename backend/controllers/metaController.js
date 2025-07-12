import db from '../models/index.js';
const { MetaAhorro } = db;

export const crearMeta = async (req, res, next) => {
    try {
        const { titulo, monto_objetivo, fecha_fin } = req.body;

        if (new Date(fecha_fin) <= new Date()) {
            return res.status(400).json({ error: 'La fecha final debe ser futura' });
        }

        const meta = await MetaAhorro.create({
            usuario_id: req.usuario.id,
            titulo,
            monto_objetivo,
            fecha_fin
        });

        res.status(201).json(meta);
    } catch (error) {
        next(error);
    }
};

export const actualizarProgreso = async (req, res, next) => {
    try {
        const meta = await MetaAhorro.findOne({
            where: { id: req.params.id, usuario_id: req.usuario.id }
        });

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        const nuevoMonto = meta.monto_actual + parseFloat(req.body.monto);
        if (nuevoMonto > meta.monto_objetivo) {
            return res.status(400).json({ error: 'Monto excede el objetivo' });
        }

        const actualizada = await meta.update({ monto_actual: nuevoMonto });
        res.json(actualizada);
    } catch (error) {
        next(error);
    }
};

export const obtenerMetas = async (req, res, next) => {
    try {
        const metas = await MetaAhorro.findAll({
            where: { usuario_id: req.usuario.id },
            order: [['fecha_fin', 'ASC']]
        });

        res.json(metas);
    } catch (error) {
        next(error);
    }
};
