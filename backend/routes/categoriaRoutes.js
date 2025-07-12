import { Router } from 'express';
import { autenticar } from '../middleware/authMiddleware.js';
import {
    crearCategoria,
    obtenerCategorias,
    actualizarCategoria
} from '../controllers/categoriaController.js';

const router = Router();

router.use(autenticar);

router.route('/')
    .post(crearCategoria)
    .get(obtenerCategorias);

router.route('/:id')
    .put(actualizarCategoria);

export default router;
