import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router;
