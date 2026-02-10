const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');

// Ruta de login (no requiere autenticación)
router.post('/login', login);

// Ruta para verificar token
router.get('/verify', verifyToken);

module.exports = router;

