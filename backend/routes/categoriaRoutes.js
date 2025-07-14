import { Router } from 'express';
import { autenticar } from '../middleware/authMiddleware.js';
import {
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriaController.js';

const router = Router();

// Primero autenticar al usuario
router.use(autenticar);

// Rutas sin aplicar el middleware de límite de gastos
router.post('/', crearCategoria);
router.get('/', obtenerCategorias);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

export default router;
