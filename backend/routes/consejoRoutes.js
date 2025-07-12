import express from 'express';
import { obtenerConsejos, votarConsejo } from '../controllers/consejoController.js';
import { autenticar } from '../middleware/authMiddleware.js';

const router = express.Router();

// Públicas
router.get('/', obtenerConsejos);

// Protegidas
router.post('/:id/votar', autenticar, votarConsejo);

export default router;
