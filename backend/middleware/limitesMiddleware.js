import db from '../models/index.js';
const { Movimiento } = db;

export const limiteGastosDiarios = async (req, res, next) => {
    try {
        if (req.body.tipo === 'egreso') {
            const hoy = new Date().toISOString().split('T')[0];

            const totalDiario = await Movimiento.sum('monto', {
                where: {
                    usuario_id: req.usuario.id,
                    tipo: 'egreso',
                    fecha: hoy
                }
            });

            const limite = req.usuario.edad < 20 ? 50 : 75;

            if ((totalDiario || 0) + req.body.monto > limite) {
                return res.status(400).json({
                    error: `Límite diario de gastos excedido (máximo ${limite} soles)`
                });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
