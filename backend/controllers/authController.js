import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { verificarPassword, generarSalt, hashearPassword } from '../utils/hashUtils.js';

const { Usuario } = db;

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = verificarPassword(password, usuario.password, usuario.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    next(error);
  }
};

export const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password, edad } = req.body;

    if (!nombre || !email || !password || !edad) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const salt = generarSalt();
    const passwordHash = hashearPassword(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      salt,
      edad,
    });

    res.status(201).json({
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    next(error);
  }
};

export const obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password', 'salt'] },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    next(error);
  }
};
