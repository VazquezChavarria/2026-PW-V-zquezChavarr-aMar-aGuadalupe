const pool = require('../db-local');
const { ErrorNegocio } = require('../errores');

// Un taller junto con cuántos alumnos tiene inscritos (se calcula, no se guarda)
const SELECT_TALLER = `
    SELECT t.id, t.nombre, t.instructor, t.cupo, COUNT(i.id) AS inscritos
    FROM talleres t
    LEFT JOIN inscripciones i ON i.taller_id = t.id`;

// consultar todos los talleres
async function listar() {
    const [filas] = await pool.query(`${SELECT_TALLER} GROUP BY t.id ORDER BY t.id`);
    return filas;
}

// consultar por taller (por id)
async function obtenerPorId(id) {
    const [filas] = await pool.query(`${SELECT_TALLER} WHERE t.id = ? GROUP BY t.id`, [id]);
    return filas[0];
}

// registrar un nuevo taller
async function crear({ nombre, instructor, cupo }) {
    const [info] = await pool.query(
        'INSERT INTO talleres (nombre, instructor, cupo) VALUES (?, ?, ?)',
        [nombre, instructor, cupo]
    );
    return obtenerPorId(info.insertId);
}

// actualizar un taller (solo los campos que lleguen)
async function actualizar(id, { nombre, instructor, cupo }) {
    const cambios = Object.entries({ nombre, instructor, cupo }).filter(([, valor]) => valor !== undefined);
    if (cambios.length === 0) return obtenerPorId(id);

    const actual = await obtenerPorId(id);
    if (!actual) return undefined;

    // No tiene sentido un cupo menor a los alumnos que ya están inscritos
    if (cupo !== undefined && cupo < actual.inscritos) {
        throw new ErrorNegocio(
            'CUPO_MENOR_A_INSCRITOS',
            `No puedes bajar el cupo a ${cupo}: ya hay ${actual.inscritos} alumnos inscritos`,
            409
        );
    }

    // Los nombres de columna salen de las llaves fijas de arriba, nunca del cliente
    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
    await pool.query(
        `UPDATE talleres SET ${columnas} WHERE id = ?`,
        [...cambios.map(([, valor]) => valor), id]
    );
    return obtenerPorId(id);
}

// eliminar un taller (sus inscripciones y asistencias se borran en cascada)
async function eliminar(id) {
    const [info] = await pool.query('DELETE FROM talleres WHERE id = ?', [id]);
    return info.affectedRows > 0;
}

// registrarse en un taller
async function inscribir(tallerId, usuarioId) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();

        // FOR UPDATE bloquea la fila del taller: si dos alumnos se inscriben al mismo
        // tiempo, el segundo espera y no puede pasarse del cupo
        const [talleres] = await conexion.query('SELECT id, cupo FROM talleres WHERE id = ? FOR UPDATE', [tallerId]);
        if (talleres.length === 0) {
            throw new ErrorNegocio('TALLER_NO_ENCONTRADO', 'Taller no encontrado', 404);
        }

        const [usuarios] = await conexion.query('SELECT id FROM usuarios WHERE id = ?', [usuarioId]);
        if (usuarios.length === 0) {
            throw new ErrorNegocio('USUARIO_NO_ENCONTRADO', 'Usuario no encontrado', 404);
        }

        const [yaInscrito] = await conexion.query(
            'SELECT id FROM inscripciones WHERE taller_id = ? AND usuario_id = ?',
            [tallerId, usuarioId]
        );
        if (yaInscrito.length > 0) {
            throw new ErrorNegocio('YA_INSCRITO', 'El alumno ya está inscrito en este taller', 409);
        }

        const [[{ total }]] = await conexion.query(
            'SELECT COUNT(*) AS total FROM inscripciones WHERE taller_id = ?',
            [tallerId]
        );
        if (total >= talleres[0].cupo) {
            throw new ErrorNegocio('CUPO_LLENO', 'El taller ya no tiene cupo disponible', 409);
        }

        const [info] = await conexion.query(
            'INSERT INTO inscripciones (usuario_id, taller_id) VALUES (?, ?)',
            [usuarioId, tallerId]
        );
        await conexion.commit();

        const [filas] = await pool.query(
            'SELECT id, usuario_id, taller_id, fecha_inscripcion FROM inscripciones WHERE id = ?',
            [info.insertId]
        );
        return filas[0];
    } catch (error) {
        await conexion.rollback();
        throw error;
    } finally {
        conexion.release();
    }
}

// cancelar la inscripción de un alumno (devuelve false si no estaba inscrito)
async function cancelarInscripcion(tallerId, usuarioId) {
    const [info] = await pool.query(
        'DELETE FROM inscripciones WHERE taller_id = ? AND usuario_id = ?',
        [tallerId, usuarioId]
    );
    return info.affectedRows > 0;
}

// alumnos inscritos en un taller
async function listarInscritos(tallerId) {
    const [filas] = await pool.query(
        `SELECT u.id, u.nombre, u.boleta, i.fecha_inscripcion
         FROM inscripciones i
         JOIN usuarios u ON u.id = i.usuario_id
         WHERE i.taller_id = ?
         ORDER BY u.nombre`,
        [tallerId]
    );
    return filas;
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    inscribir,
    cancelarInscripcion,
    listarInscritos,
};
