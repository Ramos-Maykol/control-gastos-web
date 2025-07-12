const Joi = require('joi');

const esquemaUsuario = Joi.object({
    nombre: Joi.string().pattern(/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]{3,30}$/).required(),
    correo: Joi.string().email({ 
        minDomainSegments: 2, 
        tlds: { allow: ['edu.pe', 'upc.edu.pe'] } 
    }).required(),
    carrera: Joi.string().valid(
        'Ingeniería de Sistemas',
        'Administración de Empresas',
        'Derecho',
        'Medicina'
    ).required(),
    ciclo: Joi.number().integer().min(1).max(10).required()
});

const esquemaMovimiento = Joi.object({
    monto: Joi.number().positive().precision(2).max(10000).required(),
    categoria: Joi.string().valid(
        'Alimentación',
        'Transporte',
        'Materiales',
        'Entretenimiento'
    ).required(),
    fecha: Joi.date().max('now').required()
});

module.exports = { esquemaUsuario, esquemaMovimiento };
