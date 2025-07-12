import express from 'express';
const router = express.Router();

import { autenticar } from '../middleware/authMiddleware.js';
import {
    crearMovimiento,
    obtenerMovimientos,
    actualizarMovimiento,
    eliminarMovimiento
} from '../controllers/movimientoController.js';

router.use(autenticar);

router.route('/')
    .post(crearMovimiento)
    .get(obtenerMovimientos);

router.route('/:id')
    .put(actualizarMovimiento)
    .delete(eliminarMovimiento);

export default router;
