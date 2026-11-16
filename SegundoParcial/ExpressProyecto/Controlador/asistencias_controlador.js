const asistenciasModelo = require('../Modelo/asistencias');
const talleresModelo = require('../Modelo/talleres');
const { validarBoleta, validarId, validarNombre } = require('../validaciones');

function responderError(res, error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Esa boleta ya está inscrita en este taller' });
    }
    console.error(error);
    return res.status(500).json({ error: 'No se pudo completar la operación en la base de datos' });
}

async function listarPorTaller(req, res) {
    const { id } = req.params;
    if (!validarId(id)) return res.status(400).json({ error: 'El id del taller no es válido' });
    try {
        const taller = await talleresModelo.consultarPorTaller(id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.json(await asistenciasModelo.listarPorTaller(id));
    } catch (error) {
        responderError(res, error);
    }
}

async function inscribir(req, res) {
    const cuerpo = req.body || {};
    const taller_id = Number(cuerpo.taller_id);
    const nombre_alumno = typeof cuerpo.nombre_alumno === 'string' ? cuerpo.nombre_alumno.trim() : '';
    const boleta = typeof cuerpo.boleta === 'string' ? cuerpo.boleta.trim() : '';

    if (!validarId(taller_id)) return res.status(400).json({ error: 'El id del taller no es válido' });
    if (!validarNombre(nombre_alumno)) {
        return res.status(400).json({ error: 'El nombre debe tener entre 3 y 100 caracteres' });
    }
    if (!validarBoleta(boleta)) {
        return res.status(400).json({ error: 'La boleta debe tener exactamente 10 dígitos' });
    }

    try {
        const asistencia = await asistenciasModelo.inscribir({ taller_id, nombre_alumno, boleta });
        res.status(201).json(asistencia);
    } catch (error) {
        responderError(res, error);
    }
}

async function registrarAsistenciaEnElTaller(req, res) {
    const { usuarioId, tallerId } = req.body || {};

    if (!validarId(usuarioId) || !validarId(tallerId)) {
        return res.status(400).json({ error: 'usuarioId y tallerId son obligatorios' });
    }

    try {
        const asistencia = await asistenciasModelo.registrarAsistenciaEnElTaller(usuarioId, tallerId);
        res.status(201).json(asistencia);
    } catch (error) {
        responderError(res, error);
    }
}

async function consultarListaDeAsistencias(req, res) {
    try {
        const tallerId = req.query.tallerId || null; // opcional: /asistencias?tallerId=1
        if (tallerId && !validarId(tallerId)) {
            return res.status(400).json({ error: 'El id del taller no es válido' });
        }
        const lista = await asistenciasModelo.consultarListaDeAsistencias(tallerId);
        res.json(lista);
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = { listarPorTaller, inscribir, registrarAsistenciaEnElTaller, consultarListaDeAsistencias };