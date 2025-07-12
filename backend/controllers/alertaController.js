const { Alerta } = require('../models');

const obtenerAlertasActivas = async (req, res, next) => {
    try {
        const alertas = await Alerta.findAll({
            where: { 
                usuario_id: req.usuario.id,
                activa: true,
                fecha_alerta: { [Op.lte]: new Date() }
            },
            order: [['fecha_alerta', 'DESC']]
        });
        
        res.json(alertas);
    } catch (error) {
        next(error);
    }
};

const marcarComoLeida = async (req, res, next) => {
    try {
        const alerta = await Alerta.findOne({
            where: { id: req.params.id, usuario_id: req.usuario.id }
        });
        
        if (!alerta) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        await alerta.update({ activa: false });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { obtenerAlertasActivas, marcarComoLeida };
