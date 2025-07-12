import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cluster from 'cluster';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import movimientoRoutes from './routes/movimientoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import consejoRoutes from './routes/consejoRoutes.js';
import alertaRoutes from './routes/alertaRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import swaggerRoutes from './routes/swaggerRoutes.js';

import db from './models/index.js';
import { logger, registroAccesos } from './middleware/loggerMiddleware.js';
import manejoErrores from './middleware/errorMiddleware.js';
import { limiteGastosDiarios } from './middleware/limitesMiddleware.js';
import { sanitizarInput } from './middleware/validacionMiddleware.js';

dotenv.config();
const app = express();

const API_PREFIX = '/api/v1';
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CPU_CORES = process.env.CLUSTER_MODE === 'true' ? os.cpus().length : 1;

// Seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"],
      connectSrc: ["'self'", process.env.API_BASE_URL]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
// CORS (Desarrollo - permite frontend local)
app.use(cors({
  origin: ['http://localhost:5173'], // 👈 Aquí el frontend Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Correlation-ID'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  credentials: true
}));


// Middleware de tracking
app.use((req, res, next) => {
  req.correlationId = uuidv4();
  res.set('X-Correlation-ID', req.correlationId);
  req.startTime = process.hrtime();
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'production' ? 200 : 1000,
  keyGenerator: (req) => req.ip + req.get('User-Agent'),
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 429,
        message: 'Límite de solicitudes excedido',
        retryAfter: '15 minutos'
      }
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true
});

// Conexión a la base de datos
const MAX_RETRIES = 3;
const connectWithRetry = async (retries = MAX_RETRIES) => {
  try {
    await db.sequelize.authenticate(); // ← 👈 CAMBIO AQUÍ
    await db.sequelize.sync({ alter: true }); // ← 👈 CAMBIO AQUÍ
    logger.info('✅ Base de datos sincronizada');
  } catch (err) {
    if (retries > 0) {
      logger.warn(`Reintentando conexión a DB (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectWithRetry(retries - 1), 5000);
    } else {
      logger.error('❌ Error crítico de conexión a DB:', err);
      process.exit(1);
    }
  }
};



import { generarSalt, hashearPassword } from './utils/hashUtils.js';

const crearUsuarioPorDefecto = async () => {
  console.log('🔍 Ejecutando creación de usuario por defecto...');
  const { Usuario } = db;
  const email = 'admin@demo.com';

  const existe = await Usuario.findOne({ where: { email } });
  if (!existe) {
    const salt = generarSalt();
    const hash = hashearPassword('123456', salt);
    await Usuario.create({
      nombre: 'Administrador',
      email,
      password: hash,
      salt,
      edad: 22
    });
    console.log('✅ Usuario por defecto creado (admin@demo.com / 123456)');
  } else {
    console.log('ℹ️ Usuario por defecto ya existe');
  }
};


await connectWithRetry();

db.sequelize.sync({ alter: true }).then(async () => {
  await crearUsuarioPorDefecto();
});




// Rutas
const routes = [
  { path: '/auth', router: authRoutes, limiter: authLimiter },
  { path: '/movimientos', router: movimientoRoutes },
  { path: '/categorias', router: categoriaRoutes },
  { path: '/metas', router: metaRoutes },
  { path: '/consejos', router: consejoRoutes },
  { path: '/alertas', router: alertaRoutes },
  { path: '/health', router: healthRoutes },
  { path: '/docs', router: swaggerRoutes }
];

routes.forEach(({ path, router, limiter }) => {
  app.use(`${API_PREFIX}${path}`,
    limiter || apiLimiter,
    limiteGastosDiarios,
    sanitizarInput,
    router
  );
  logger.info(`Ruta registrada: ${API_PREFIX}${path}`);
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorDetails = {
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  };

  logger.error(`Error ${statusCode}`, {
    ...errorDetails,
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    error: {
      code: statusCode,
      message: statusCode === 500 ? 'Error interno del servidor' : err.message,
      details: NODE_ENV !== 'production' ? {
        correlationId: errorDetails.correlationId,
        stack: err.stack?.split('\n')
      } : undefined
    }
  });
});

// Cluster
if (cluster.isPrimary && CPU_CORES > 1) {
  logger.info(`Iniciando cluster con ${CPU_CORES} workers`);
  for (let i = 0; i < CPU_CORES; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    logger.warn(`Worker ${worker.process.pid} caído. Reiniciando...`);
    cluster.fork();
  });
} else {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Servidor: Puerto ${PORT}\n🌍 Entorno: ${NODE_ENV}\n⚙️  Workers: ${CPU_CORES}\n⏰ Hora: ${new Date().toLocaleTimeString()}`);
  });

  const shutdown = async (signal) => {
    logger.warn(`🔴 Recibido ${signal}. Cerrando servidor...`);
    await server.close();
    await db.close();
    logger.info('✅ Servidor y conexiones cerradas');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    shutdown('unhandledRejection');
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    shutdown('uncaughtException');
  });
}

// Middleware de errores al final
app.use(manejoErrores);
