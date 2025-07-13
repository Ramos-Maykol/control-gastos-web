import db from '../models/index.js';
const { Movimiento } = db;

export const limiteGastosDiarios = async (req, res, next) => {
  try {
    // Verificamos que el usuario esté autenticado
    if (!req.usuario || !req.usuario.id || !req.usuario.edad) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Solo aplicar si es un POST y es un tipo egreso
    if (
      req.method === 'POST' &&
      req.body &&
      req.body.tipo === 'egreso'
    ) {
      const hoy = new Date().toISOString().split('T')[0];

      const totalDiario = await Movimiento.sum('monto', {
        where: {
          usuario_id: req.usuario.id,
          tipo: 'egreso',
          fecha: hoy
        }
      });

      const montoActual = Number(req.body.monto);
      const limite = req.usuario.edad < 20 ? 50 : 75;

      if ((totalDiario || 0) + montoActual > limite) {
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
