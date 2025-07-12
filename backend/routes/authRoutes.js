import { Router } from 'express';
import { login, registrar, obtenerPerfil } from '../controllers/authController.js';
import { autenticar } from '../middleware/authMiddleware.js';

const router = Router();

// Rutas públicas
router.post('/login', login);
router.post('/registrar', registrar);

// Ruta protegida
router.get('/perfil', autenticar, obtenerPerfil);

export default router;
