import morgan from 'morgan';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Si no estás en producción, imprime también en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware para registrar accesos HTTP
const registroAccesos = morgan((tokens, req, res) => {
  return JSON.stringify({
    metodo: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    tiempo: `${tokens['response-time'](req, res)}ms`,
    ip: req.ip,
    usuario: req.usuario?.id || 'anonimo'
  });
}, {
  stream: {
    write: message => logger.info(JSON.parse(message))
  }
});

export { logger, registroAccesos };
