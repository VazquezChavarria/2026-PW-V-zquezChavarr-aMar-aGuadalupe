const asistenciasModelo = require('../Modelo/asistencias');
const { validarId, validarFecha } = require('../validaciones');
const { responderError } = require('../errores');

// Fecha de hoy como AAAA-MM-DD en la zona horaria de la computadora
function hoy() {
    return new Date().toLocaleDateString('en-CA');
}

// registrar asistencia:  POST /asistencias  { "usuarioId": 3, "tallerId": 1, "fecha": "2026-10-21" }
// Si no mandas la fecha, se usa la de hoy.
async function registrarAsistencia(req, res) {
    const { usuarioId, tallerId, fecha } = req.body ?? {};

    if (usuarioId === undefined || tallerId === undefined) {
        return res.status(400).json({ error: 'usuarioId y tallerId son obligatorios, favor de verificar los datos' });
    }
    if (!validarId(usuarioId)) return res.status(400).json({ error: 'usuarioId debe ser un número entero positivo' });
    if (!validarId(tallerId)) return res.status(400).json({ error: 'tallerId debe ser un número entero positivo' });

    const fechaFinal = fecha ?? hoy();
    if (!validarFecha(fechaFinal)) {
        return res.status(400).json({ error: 'La fecha debe tener el formato AAAA-MM-DD y existir en el calendario' });
    }

    try {
        const asistencia = await asistenciasModelo.registrar({
            usuarioId: Number(usuarioId),
            tallerId: Number(tallerId),
            fecha: fechaFinal,
        });
        res.status(201).json(asistencia);
    } catch (error) {
        responderError(res, error);
    }
}

// lista de asistencias de un taller:  GET /asistencias/taller/:tallerId?fecha=2026-10-21
async function consultarListaDeAsistencias(req, res) {
    const { tallerId } = req.params;
    const { fecha } = req.query;

    if (!validarId(tallerId)) return res.status(400).json({ error: 'tallerId debe ser un número entero positivo' });
    if (fecha !== undefined && !validarFecha(fecha)) {
        return res.status(400).json({ error: 'La fecha debe tener el formato AAAA-MM-DD y existir en el calendario' });
    }

    try {
        const lista = await asistenciasModelo.consultarListaDeAsistencias(Number(tallerId), fecha);
        res.json(lista);
    } catch (error) {
        responderError(res, error);
    }
}

// asistencias de un alumno:  GET /asistencias/usuario/:usuarioId
async function consultarAsistenciasDeUsuario(req, res) {
    const { usuarioId } = req.params;

    if (!validarId(usuarioId)) return res.status(400).json({ error: 'usuarioId debe ser un número entero positivo' });

    try {
        const lista = await asistenciasModelo.consultarAsistenciasDeUsuario(Number(usuarioId));
        res.json(lista);
    } catch (error) {
        responderError(res, error);
    }
}

// eliminar una asistencia:  DELETE /asistencias/:id
async function eliminarAsistencia(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: 'El id debe ser un número entero positivo' });

    try {
        const eliminada = await asistenciasModelo.eliminar(Number(req.params.id));
        if (!eliminada) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.status(204).send();
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = {
    registrarAsistencia,
    consultarListaDeAsistencias,
    consultarAsistenciasDeUsuario,
    eliminarAsistencia,
};
