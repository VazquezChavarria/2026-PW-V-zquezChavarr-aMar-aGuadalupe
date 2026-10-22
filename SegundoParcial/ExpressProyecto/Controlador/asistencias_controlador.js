const asistenciasModelo = require('../Modelo/asistencias');

async function registrarAsistenciaEnElTaller(req, res) {
    const { usuarioId, tallerId } = req.body;

    if (!usuarioId || !tallerId) {
        return res.status(400).json({ error: 'usuarioId y tallerId son obligatorios' });
    }

    try {
        const asistencia = await asistenciasModelo.registrarAsistenciaEnElTaller(usuarioId, tallerId);
        res.status(201).json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function consultarListaDeAsistencias(req, res) {
    try {
        const tallerId = req.query.tallerId || null; // opcional: /asistencias?tallerId=1
        const lista = await asistenciasModelo.consultarListaDeAsistencias(tallerId);
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { registrarAsistenciaEnElTaller, consultarListaDeAsistencias };