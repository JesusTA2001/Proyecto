const express = require('express');
const router = express.Router();
const { login, verifyToken, cambiarContrasena } = require('../controllers/authController');

// Ruta de login (no requiere autenticación)
router.post('/login', login);

// Ruta para verificar token
router.get('/verify', verifyToken);

// Ruta para cambiar contraseña
router.put('/cambiar-contrasena', cambiarContrasena);

module.exports = router;
