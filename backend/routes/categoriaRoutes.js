import { Router } from 'express';
import { autenticar } from '../middleware/authMiddleware.js';
import { limiteGastosDiarios } from '../middleware/limitesMiddleware.js';
import {
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriaController.js';

const router = Router();

// Primero autenticar al usuario
router.use(autenticar);

// Luego aplicar middleware de límite solo a POST
router.post('/', limiteGastosDiarios, crearCategoria);

// Resto de rutas
router.get('/', obtenerCategorias);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

export default router;
