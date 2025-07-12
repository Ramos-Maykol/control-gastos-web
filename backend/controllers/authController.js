import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const { Usuario } = db;

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValid = await bcrypt.compare(password, usuario.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ 
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const registrar = async (req, res, next) => {
    try {
        const { nombre, email, password, edad } = req.body;
        
        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password,
            edad
        });

        res.status(201).json({
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerPerfil = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: { exclude: ['password', 'salt'] }
        });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(usuario);
    } catch (error) {
        next(error);
    }
};
