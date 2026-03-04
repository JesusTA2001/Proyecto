const express = require('express');
const router = express.Router();
const estadoGrupoController = require('../controllers/estadoGrupoController');

// Verificar y actualizar estado de grupos automáticamente
router.post('/verificar', estadoGrupoController.verificarEstadoGrupos);

// Inactivar un grupo manualmente
router.patch('/:id/inactivar', estadoGrupoController.inactivarGrupo);

// Reactivar un grupo manualmente
router.patch('/:id/reactivar', estadoGrupoController.reactivarGrupo);

// Obtener historial de grupos inactivos
router.get('/inactivos', estadoGrupoController.getGruposInactivos);

module.exports = router;
