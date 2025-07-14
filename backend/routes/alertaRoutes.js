// routes/alertaRoutes.js
import express from 'express';
// Importa las funciones del controlador de alertas
import { obtenerAlertasActivas, marcarComoLeida, crearAlerta } from '../controllers/alertaController.js';
// Importa el middleware de autenticación
import { autenticar } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para obtener alertas activas del usuario (PROTEGIDA)
router.get('/', autenticar, obtenerAlertasActivas);

// Ruta para crear una nueva alerta (PROTEGIDA)
// Asumo que tu controlador de alertas tiene una función 'crearAlerta'
// Si no la tienes, necesitarás crearla en tu alertaController.js
router.post('/', autenticar, crearAlerta);

// Ruta para marcar una alerta como leída (inactiva) (PROTEGIDA)
router.put('/:id/marcar-leida', autenticar, marcarComoLeida);

export default router;
