const pool = require('../db-local');
const { ErrorNegocio } = require('../errores');

// Una asistencia con el nombre del alumno y del taller
const SELECT_ASISTENCIA = `
    SELECT a.id, a.fecha, a.usuario_id, u.nombre AS alumno, u.boleta, a.taller_id, t.nombre AS taller
    FROM asistencias a
    JOIN usuarios u ON u.id = a.usuario_id
    JOIN talleres t ON t.id = a.taller_id`;

async function existe(tabla, id) {
    // `tabla` solo recibe 'talleres' o 'usuarios' desde este archivo, nunca del cliente
    const [filas] = await pool.query(`SELECT id FROM ${tabla} WHERE id = ?`, [id]);
    return filas.length > 0;
}

async function obtenerPorId(id) {
    const [filas] = await pool.query(`${SELECT_ASISTENCIA} WHERE a.id = ?`, [id]);
    return filas[0];
}

// registrar asistencia de un alumno en un taller (solo si está inscrito)
async function registrar({ usuarioId, tallerId, fecha }) {
    const [inscripcion] = await pool.query(
        'SELECT id FROM inscripciones WHERE usuario_id = ? AND taller_id = ?',
        [usuarioId, tallerId]
    );

    if (inscripcion.length === 0) {
        // Decimos exactamente qué falla: taller inexistente, usuario inexistente o no inscrito
        if (!(await existe('talleres', tallerId))) {
            throw new ErrorNegocio('TALLER_NO_ENCONTRADO', 'Taller no encontrado', 404);
        }
        if (!(await existe('usuarios', usuarioId))) {
            throw new ErrorNegocio('USUARIO_NO_ENCONTRADO', 'Usuario no encontrado', 404);
        }
        throw new ErrorNegocio('NO_INSCRITO', 'El alumno no está inscrito en ese taller', 409);
    }

    try {
        const [info] = await pool.query(
            'INSERT INTO asistencias (usuario_id, taller_id, fecha) VALUES (?, ?, ?)',
            [usuarioId, tallerId, fecha]
        );
        return obtenerPorId(info.insertId);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ErrorNegocio('ASISTENCIA_DUPLICADA', 'La asistencia de ese alumno ya está registrada en esa fecha', 409);
        }
        throw error;
    }
}

// consultar la lista de asistencias de un taller (opcionalmente de un solo día)
async function consultarListaDeAsistencias(tallerId, fecha) {
    if (!(await existe('talleres', tallerId))) {
        throw new ErrorNegocio('TALLER_NO_ENCONTRADO', 'Taller no encontrado', 404);
    }

    const condiciones = ['a.taller_id = ?'];
    const valores = [tallerId];
    if (fecha) {
        condiciones.push('a.fecha = ?');
        valores.push(fecha);
    }

    const [filas] = await pool.query(
        `${SELECT_ASISTENCIA} WHERE ${condiciones.join(' AND ')} ORDER BY a.fecha, u.nombre`,
        valores
    );
    return filas;
}

// consultar todas las asistencias de un alumno
async function consultarAsistenciasDeUsuario(usuarioId) {
    if (!(await existe('usuarios', usuarioId))) {
        throw new ErrorNegocio('USUARIO_NO_ENCONTRADO', 'Usuario no encontrado', 404);
    }

    const [filas] = await pool.query(
        `${SELECT_ASISTENCIA} WHERE a.usuario_id = ? ORDER BY a.fecha DESC, t.nombre`,
        [usuarioId]
    );
    return filas;
}

// eliminar una asistencia registrada por error
async function eliminar(id) {
    const [info] = await pool.query('DELETE FROM asistencias WHERE id = ?', [id]);
    return info.affectedRows > 0;
}

module.exports = {
    registrar,
    consultarListaDeAsistencias,
    consultarAsistenciasDeUsuario,
    eliminar,
};
