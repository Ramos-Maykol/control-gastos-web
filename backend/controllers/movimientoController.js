import { Movimiento, Categoria } from '../models/index.js';
import { Op } from 'sequelize';

export const crearMovimiento = async (req, res, next) => {
    try {
        const { tipo, monto, categoria_id, fecha, descripcion } = req.body;
        
        const categoria = await Categoria.findOne({
        where: {
            id: categoria_id,
            [Op.or]: [
            { usuario_id: req.usuario.id },
            { es_global: true }
            ]
        }
        });
        
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no válida' });
        }

        const movimiento = await Movimiento.create({
            usuario_id: req.usuario.id,
            tipo,
            monto,
            categoria_id,
            fecha: fecha || new Date(),
            descripcion
        });

        res.status(201).json(movimiento);
    } catch (error) {
        next(error);
    }
};

export const obtenerMovimientos = async (req, res, next) => {
    try {
        const { tipo, desde, hasta } = req.query;
        
        const where = { usuario_id: req.usuario.id };
        if (tipo) where.tipo = tipo;
        if (desde && hasta) where.fecha = { [Op.between]: [desde, hasta] };

        const movimientos = await Movimiento.findAll({
            where,
            include: [{
            model: Categoria,
            as: 'categoria', // 👈 Usa el alias exacto que definiste en la asociación
            attributes: ['nombre', 'tipo']
            }],

            order: [['fecha', 'DESC']]
        });

        res.json(movimientos);
    } catch (error) {
        next(error);
    }
};

export const actualizarMovimiento = async (req, res, next) => {
    try {
        const movimiento = await Movimiento.findOne({
            where: { id: req.params.id, usuario_id: req.usuario.id }
        });
        
        if (!movimiento) {
            return res.status(404).json({ error: 'Movimiento no encontrado' });
        }

        const actualizado = await movimiento.update(req.body);
        res.json(actualizado);
    } catch (error) {
        next(error);
    }
};

export const eliminarMovimiento = async (req, res, next) => {
    try {
        const movimiento = await Movimiento.findOne({
            where: { id: req.params.id, usuario_id: req.usuario.id }
        });
        
        if (!movimiento) {
            return res.status(404).json({ error: 'Movimiento no encontrado' });
        }

        await movimiento.destroy();
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
