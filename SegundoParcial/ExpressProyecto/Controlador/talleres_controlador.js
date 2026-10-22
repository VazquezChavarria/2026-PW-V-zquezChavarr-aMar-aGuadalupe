const talleresModelo = require('../Modelo/talleres');

async function listarTalleres(req, res) {
    try {
        const talleres = await talleresModelo.listar();
        res.json(talleres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function consultarPorTaller(req, res) {
    try {
        const taller = await talleresModelo.consultarPorTaller(req.params.id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.json(taller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function registrarseEnUnTaller(req, res) {
    const { usuarioId, tallerId } = req.body;

    if (!usuarioId || !tallerId) {
        return res.status(400).json({ error: 'usuarioId y tallerId son obligatorios' });
    }

    try {
        const registro = await talleresModelo.registrarseEnUnTaller(usuarioId, tallerId);
        res.status(201).json(registro);
    } catch (error) {
        if (error.message.includes('ya está registrado')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

module.exports = { listarTalleres, consultarPorTaller, registrarseEnUnTaller };