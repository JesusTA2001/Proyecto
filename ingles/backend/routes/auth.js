const express = require('express');
const router = express.Router();
const { login, verifyToken, cambiarContrasena, restablecerContrasena } = require('../controllers/authController');

// Ruta de login (no requiere autenticación)
router.post('/login', login);

// Ruta para verificar token
router.get('/verify', verifyToken);

// Ruta para cambiar contraseña
router.put('/cambiar-contrasena', cambiarContrasena);

// Ruta para restablecer contraseña a 123456
router.put('/restablecer-contrasena', restablecerContrasena);

module.exports = router;
