import { Router } from 'express';
import { login, registrar, obtenerPerfil } from '../controllers/authController.js';
import { autenticar } from '../middleware/authMiddleware.js';

const router = Router();

// Autenticación pública
router.post('/login', login);
router.post('/registrar', registrar);

// Perfil protegido
router.get('/perfil', autenticar, obtenerPerfil);

export default router;
