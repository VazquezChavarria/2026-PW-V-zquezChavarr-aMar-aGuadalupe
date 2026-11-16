const pool = require('../db-local');

async function listarPorTaller(tallerId) {
    const [filas] = await pool.query(`
        SELECT id, taller_id, usuario_id, nombre_alumno, boleta, fecha_registro
        FROM asistencias
        WHERE taller_id = ?
        ORDER BY fecha_registro, id
    `, [tallerId]);
    return filas;
}

async function inscribir({ taller_id, nombre_alumno, boleta }) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        const [talleres] = await conexion.query(
            'SELECT id, cupo FROM talleres WHERE id = ? FOR UPDATE',
            [taller_id]
        );
        if (!talleres[0]) {
            const error = new Error('Taller no encontrado');
            error.status = 404;
            throw error;
        }

        const [repetidas] = await conexion.query(
            'SELECT id FROM asistencias WHERE taller_id = ? AND boleta = ?',
            [taller_id, boleta]
        );
        if (repetidas.length) {
            const error = new Error('Esa boleta ya está inscrita en este taller');
            error.status = 409;
            throw error;
        }

        const [[{ total }]] = await conexion.query(
            'SELECT COUNT(*) AS total FROM asistencias WHERE taller_id = ?',
            [taller_id]
        );
        if (Number(total) >= talleres[0].cupo) {
            const error = new Error('El taller ya no tiene lugares');
            error.status = 409;
            throw error;
        }

        const [usuarios] = await conexion.query(
            'SELECT id FROM usuarios WHERE boleta = ?',
            [boleta]
        );
        const usuarioId = usuarios[0] ? usuarios[0].id : null;
        const [resultado] = await conexion.query(`
            INSERT INTO asistencias (taller_id, usuario_id, nombre_alumno, boleta)
            VALUES (?, ?, ?, ?)
        `, [taller_id, usuarioId, nombre_alumno, boleta]);

        await conexion.commit();
        return {
            id: resultado.insertId,
            taller_id: Number(taller_id),
            usuario_id: usuarioId,
            nombre_alumno,
            boleta,
        };
    } catch (error) {
        await conexion.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            error.status = 409;
            error.message = 'Esa boleta ya está inscrita en este taller';
        }
        throw error;
    } finally {
        conexion.release();
    }
}

async function registrarAsistenciaEnElTaller(usuarioId, tallerId) {
    const [filas] = await pool.query(
        'SELECT nombre, boleta FROM usuarios WHERE id = ?',
        [usuarioId]
    );
    if (!filas[0]) {
        const error = new Error('Usuario no encontrado');
        error.status = 404;
        throw error;
    }
    return inscribir({
        taller_id: tallerId,
        nombre_alumno: filas[0].nombre,
        boleta: filas[0].boleta,
    });
}

async function consultarListaDeAsistencias(tallerId = null) {
    const filtro = tallerId ? 'WHERE a.taller_id = ?' : '';
    const parametros = tallerId ? [tallerId] : [];
    const [filas] = await pool.query(`
        SELECT a.id, a.fecha_registro AS fecha, a.usuario_id, a.taller_id,
               a.nombre_alumno AS nombre_usuario, a.boleta,
               t.nombre AS nombre_taller
        FROM asistencias a
        JOIN talleres t ON t.id = a.taller_id
        ${filtro}
        ORDER BY a.fecha_registro DESC, a.id DESC
    `, parametros);
    return filas;
}

module.exports = {
    listarPorTaller,
    inscribir,
    registrarAsistenciaEnElTaller,
    consultarListaDeAsistencias,
};
