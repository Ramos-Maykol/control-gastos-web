import db from '../models/index.js';
const { Consejo, sequelize } = db;

export const obtenerConsejos = async (req, res, next) => {
    try {
        const { publico, dificultad } = req.query;
        const where = {};

        if (publico) where.publico_objetivo = publico;
        if (dificultad) where.dificultad = dificultad;

        const consejos = await Consejo.findAll({
            where,
            order: [[sequelize.literal('(votos_positivos - votos_negativos)'), 'DESC']]
        });

        res.json(consejos);
    } catch (error) {
        next(error);
    }
};

export const votarConsejo = async (req, res, next) => {
    try {
        const consejo = await Consejo.findByPk(req.params.id);
        if (!consejo) {
            return res.status(404).json({ error: 'Consejo no encontrado' });
        }

        const { voto } = req.body;
        const updateField = voto === 'positivo'
            ? 'votos_positivos'
            : 'votos_negativos';

        await consejo.increment(updateField);
        res.json(consejo);
    } catch (error) {
        next(error);
    }
};
