const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';

// consultar todos los usuarios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`);
    return filas;
}

// consultar por id
async function obtenerPorId(id) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
    return filas[0];
}

// registrar un nuevo usuario
async function crear({ nombre, correo, contrasenaHash, boleta, rol }) {
    const [info] = await pool.query(
        `INSERT INTO usuarios (nombre, correo, contrasena_hash, boleta, rol) VALUES (?, ?, ?, ?, ?)`,
        [nombre.trim(), correo.trim().toLowerCase(), contrasenaHash, boleta.trim(), rol || 'alumno']
    );
    return obtenerPorId(info.insertId);
}

// actualizar un usuario (solo los campos que lleguen)
async function actualizar(id, { nombre, correo, rol }) {
    // CORRECCIÓN: sin corchetes; así `cambios` es la lista completa de [columna, valor]
    const cambios = Object.entries({ nombre, correo, rol })
        .filter(([, valor]) => valor !== undefined)
        .map(([columna, valor]) => [
            columna,
            typeof valor === 'string' ? valor.trim() : valor,
        ]);
    const correoCambio = cambios.find(([columna]) => columna === 'correo');
    if (correoCambio) correoCambio[1] = correoCambio[1].toLowerCase();
    if (cambios.length === 0) return obtenerPorId(id);

    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
    const [info] = await pool.query(
        `UPDATE usuarios SET ${columnas} WHERE id = ?`,
        [...cambios.map(([, valor]) => valor), id]
    );
    if (info.affectedRows === 0) return undefined;
    return obtenerPorId(id);
}

// eliminar
async function eliminar(id) {
    const [info] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [id]);
    return info.affectedRows > 0;
}

// buscar por correo (incluye el hash, para el login)
async function buscarPorCorreoConHash(correo) {
    const [filas] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [correo]);
    return filas[0];
}

// siempre hay que exportar las funciones para poder crear la API
module.exports = { listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCorreoConHash };
