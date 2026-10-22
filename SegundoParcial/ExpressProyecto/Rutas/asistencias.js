const express = require('express');
const asistencias = require('../Controlador/asistencias_controlador');

const router = express.Router();

router.post('/', asistencias.registrarAsistencia);
router.get('/taller/:tallerId', asistencias.consultarListaDeAsistencias);
router.get('/usuario/:usuarioId', asistencias.consultarAsistenciasDeUsuario);
router.delete('/:id', asistencias.eliminarAsistencia);

module.exports = router;
