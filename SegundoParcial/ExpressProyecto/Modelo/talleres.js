const pool = require('../db-local');

async function listar() {
    const [filas] = await pool.query(`
        SELECT t.id, t.nombre, t.descripcion, t.instructor, t.fecha, t.cupo,
               COUNT(a.id) AS asistentes
        FROM talleres t
        LEFT JOIN asistencias a ON a.taller_id = t.id
        GROUP BY t.id
        ORDER BY t.fecha, t.id
    `);
    return filas;
}

async function consultarPorTaller(id) {
    const [filas] = await pool.query(`
        SELECT t.id, t.nombre, t.descripcion, t.instructor, t.fecha, t.cupo,
               COUNT(a.id) AS asistentes
        FROM talleres t
        LEFT JOIN asistencias a ON a.taller_id = t.id
        WHERE t.id = ?
        GROUP BY t.id
    `, [id]);
    return filas[0];
}

async function registrarseEnUnTaller(usuarioId, tallerId) {
    return require('./asistencias').registrarAsistenciaEnElTaller(usuarioId, tallerId);
}

module.exports = { listar, consultarPorTaller, registrarseEnUnTaller };