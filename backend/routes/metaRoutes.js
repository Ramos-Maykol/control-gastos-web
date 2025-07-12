import express from 'express';
import { autenticar } from '../middleware/authMiddleware.js';
import {
    crearMeta,
    obtenerMetas,
    actualizarProgreso
} from '../controllers/metaController.js';

const router = express.Router();

router.use(autenticar);

router.route('/')
    .post(crearMeta)
    .get(obtenerMetas);

router.route('/:id/progreso')
    .put(actualizarProgreso);

export default router;
