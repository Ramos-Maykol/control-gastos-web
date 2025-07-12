import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const { Usuario } = db;

const autenticar = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error('Acceso no autorizado');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id, {
            attributes: { exclude: ['password', 'salt'] }
        });

        if (!usuario) throw new Error('Usuario no encontrado');
        req.usuario = usuario;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};


export { autenticar };
