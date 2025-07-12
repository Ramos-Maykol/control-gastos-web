import logger from '../utils/logger.js';

const manejoErrores = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const mensaje = err.message || 'Error interno del servidor';
    
    logger.error(`${status} - ${mensaje}`, {
        ruta: req.originalUrl,
        metodo: req.method,
        ip: req.ip,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    res.status(status).json({
        exito: false,
        mensaje: process.env.NODE_ENV === 'production' && status === 500 
            ? 'Error interno del servidor' 
            : mensaje,
        detalles: process.env.NODE_ENV === 'development' ? {
            stack: err.stack,
            error: err
        } : undefined
    });
};

export default manejoErrores;
