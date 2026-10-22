const talleresModelo = require('../Modelo/talleres');
const { validarId, validarCupo, validarTexto } = require('../validaciones');
const { responderError } = require('../errores');

const ERROR_ID = 'El id debe ser un número entero positivo';

async function listarTalleres(req, res) {
    try {
        res.json(await talleresModelo.listar());
    } catch (error) {
        responderError(res, error);
    }
}

// consultar por taller
async function obtenerTaller(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: ERROR_ID });

    try {
        const taller = await talleresModelo.obtenerPorId(Number(req.params.id));
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

async function crearTaller(req, res) {
    const { nombre, instructor, cupo } = req.body ?? {};

    if (!nombre || !instructor || cupo === undefined) {
        return res.status(400).json({ error: 'nombre, instructor y cupo son obligatorios, favor de verificar los datos' });
    }
    if (!validarTexto(nombre)) return res.status(400).json({ error: 'El nombre debe tener entre 1 y 120 caracteres' });
    if (!validarTexto(instructor)) return res.status(400).json({ error: 'El instructor debe tener entre 1 y 120 caracteres' });
    if (!validarCupo(cupo)) return res.status(400).json({ error: 'El cupo debe ser un número entero mayor a 0' });

    try {
        const taller = await talleresModelo.crear({
            nombre: nombre.trim(),
            instructor: instructor.trim(),
            cupo: Number(cupo),
        });
        res.status(201).json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

async function actualizarTaller(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: ERROR_ID });

    const { nombre, instructor, cupo } = req.body ?? {};

    if (nombre === undefined && instructor === undefined && cupo === undefined) {
        return res.status(400).json({ error: 'Debe ingresar alguno de los siguientes datos para actualizar: nombre, instructor o cupo' });
    }
    if (nombre !== undefined && !validarTexto(nombre)) {
        return res.status(400).json({ error: 'El nombre debe tener entre 1 y 120 caracteres' });
    }
    if (instructor !== undefined && !validarTexto(instructor)) {
        return res.status(400).json({ error: 'El instructor debe tener entre 1 y 120 caracteres' });
    }
    if (cupo !== undefined && !validarCupo(cupo)) {
        return res.status(400).json({ error: 'El cupo debe ser un número entero mayor a 0' });
    }

    try {
        const taller = await talleresModelo.actualizar(Number(req.params.id), {
            nombre: nombre?.trim(),
            instructor: instructor?.trim(),
            cupo: cupo === undefined ? undefined : Number(cupo),
        });
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.status(200).json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

async function eliminarTaller(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: ERROR_ID });

    try {
        const eliminado = await talleresModelo.eliminar(Number(req.params.id));
        if (!eliminado) return res.status(404).json({ error: 'Taller no encontrado' });
        res.status(204).send();
    } catch (error) {
        responderError(res, error);
    }
}

// registrarse en un taller:  POST /talleres/:id/inscripciones  { "usuarioId": 3 }
async function inscribirseEnTaller(req, res) {
    const { usuarioId } = req.body ?? {};

    if (!validarId(req.params.id)) return res.status(400).json({ error: ERROR_ID });
    if (usuarioId === undefined) return res.status(400).json({ error: 'usuarioId es obligatorio' });
    if (!validarId(usuarioId)) return res.status(400).json({ error: 'usuarioId debe ser un número entero positivo' });

    try {
        const inscripcion = await talleresModelo.inscribir(Number(req.params.id), Number(usuarioId));
        res.status(201).json(inscripcion);
    } catch (error) {
        responderError(res, error);
    }
}

// cancelar inscripción:  DELETE /talleres/:id/inscripciones/:usuarioId
async function cancelarInscripcion(req, res) {
    if (!validarId(req.params.id) || !validarId(req.params.usuarioId)) {
        return res.status(400).json({ error: ERROR_ID });
    }

    try {
        const cancelada = await talleresModelo.cancelarInscripcion(
            Number(req.params.id),
            Number(req.params.usuarioId)
        );
        if (!cancelada) return res.status(404).json({ error: 'El alumno no está inscrito en ese taller' });
        res.status(204).send();
    } catch (error) {
        responderError(res, error);
    }
}

// alumnos inscritos:  GET /talleres/:id/inscritos
async function listarInscritos(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: ERROR_ID });

    try {
        const taller = await talleresModelo.obtenerPorId(Number(req.params.id));
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.json(await talleresModelo.listarInscritos(Number(req.params.id)));
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = {
    listarTalleres,
    obtenerTaller,
    crearTaller,
    actualizarTaller,
    eliminarTaller,
    inscribirseEnTaller,
    cancelarInscripcion,
    listarInscritos,
};
