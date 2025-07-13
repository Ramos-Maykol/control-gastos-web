import { Op } from 'sequelize';
import db from '../models/index.js';

const { Categoria } = db;

export const crearCategoria = async (req, res, next) => {
    try {
        const { nombre, tipo, es_global } = req.body;

        const categoriaData = {
            nombre,
            tipo,
            es_global,
            usuario_id: es_global ? null : req.usuario.id
        };

        const categoria = await Categoria.create(categoriaData);
        res.status(201).json(categoria);
    } catch (error) {
        next(error);
    }
};

export const obtenerCategorias = async (req, res, next) => {
    try {
        const where = {
            [Op.or]: [
                { es_global: true },
                { usuario_id: req.usuario.id }
            ]
        };

        const categorias = await Categoria.findAll({ where });
        res.json(categorias);
    } catch (error) {
        next(error);
    }
};

export const actualizarCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findOne({
            where: {
                id: req.params.id,
                [Op.or]: [
                    { es_global: true },
                    { usuario_id: req.usuario.id }
                ]
            }
        });

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const actualizada = await categoria.update(req.body);
        res.json(actualizada);
    } catch (error) {
        next(error);
    }
};

export const eliminarCategoria = async (req, res, next) => {
    try {
        const categoria = await Categoria.findOne({
            where: {
                id: req.params.id,
                [Op.or]: [
                    { es_global: true },
                    { usuario_id: req.usuario.id }
                ]
            }
        });

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await categoria.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
