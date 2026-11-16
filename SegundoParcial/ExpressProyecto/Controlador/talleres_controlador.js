const talleresModelo = require('../Modelo/talleres');
const { validarId } = require('../validaciones');

function responderError(res, error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error(error);
    return res.status(500).json({ error: 'No se pudo consultar la base de datos' });
}

async function listarTalleres(req, res) {
    try {
        const talleres = await talleresModelo.listar();
        res.json(talleres);
    } catch (error) {
        responderError(res, error);
    }
}

async function consultarPorTaller(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: 'El id del taller no es válido' });
    try {
        const taller = await talleresModelo.consultarPorTaller(req.params.id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

async function registrarseEnUnTaller(req, res) {
    const { usuarioId, tallerId } = req.body;

    if (!validarId(usuarioId) || !validarId(tallerId)) {
        return res.status(400).json({ error: 'usuarioId y tallerId son obligatorios' });
    }

    try {
        const registro = await talleresModelo.registrarseEnUnTaller(usuarioId, tallerId);
        res.status(201).json(registro);
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = { listarTalleres, consultarPorTaller, registrarseEnUnTaller };