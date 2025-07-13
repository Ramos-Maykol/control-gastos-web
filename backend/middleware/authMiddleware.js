// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { Usuario } = db;

const autenticar = async (req, res, next) => {
  try {
    // Verificamos si se incluye el token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Token inválido o malformado' });
    }

    // Buscamos al usuario asociado
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'salt'] }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Adjuntamos el usuario al request
    req.usuario = usuario;
    next();

  } catch (error) {
    console.error('Error en autenticar middleware:', error.message);
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
};

export { autenticar };
