const pool = require('../db-local');

// registrarAsistenciaEnElTaller
async function registrarAsistenciaEnElTaller(usuarioId, tallerId) {
    const [info] = await pool.query(
        `INSERT INTO asistencias (usuario_id, taller_id, fecha) VALUES (?, ?, NOW())`,
        [usuarioId, tallerId]
    );
    return { id: info.insertId, usuario_id: usuarioId, taller_id: tallerId, fecha: new Date() };
}

// consultarListaDeAsistencias (todas o filtradas por taller)
async function consultarListaDeAsistencias(tallerId = null) {
    let query = `
        SELECT a.id, a.fecha, a.usuario_id, a.taller_id,
               u.nombre AS nombre_usuario, u.boleta,
               t.nombre AS nombre_taller
        FROM asistencias a
        JOIN usuarios u ON a.usuario_id = u.id
        JOIN talleres t ON a.taller_id = t.id
    `;
    const params = [];

    if (tallerId) {
        query += ` WHERE a.taller_id = ?`;
        params.push(tallerId);
    }

    query += ` ORDER BY a.fecha DESC`;

    const [filas] = await pool.query(query, params);
    return filas;
}

module.exports = { registrarAsistenciaEnElTaller, consultarListaDeAsistencias };