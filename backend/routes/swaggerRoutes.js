import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = express.Router();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Control de Gastos API',
    version: '1.0.0',
    description: 'Documentación de la API para la aplicación de control de gastos',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Archivos donde están tus endpoints (puedes ajustar según tu estructura)
};

const swaggerSpec = swaggerJsdoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

export default router;
