const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/periodoController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para periodos
router.get('/', periodoController.getPeriodos);
router.get('/:id', periodoController.getPeriodoById);

module.exports = router;
