const express = require('express');
const talleres = require('../Controlador/talleres_controlador');

const router = express.Router();

router.get('/', talleres.listarTalleres);
router.post('/', talleres.crearTaller);
router.get('/:id', talleres.obtenerTaller);
router.put('/:id', talleres.actualizarTaller);
router.delete('/:id', talleres.eliminarTaller);

// inscripciones de alumnos en el taller
router.get('/:id/inscritos', talleres.listarInscritos);
router.post('/:id/inscripciones', talleres.inscribirseEnTaller);
router.delete('/:id/inscripciones/:usuarioId', talleres.cancelarInscripcion);

module.exports = router;
