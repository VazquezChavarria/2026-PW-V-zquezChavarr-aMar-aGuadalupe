// CORRECCIÓN: el paquete instalado es bcryptjs (no bcrypt)
const bcrypt = require('bcryptjs');
// CORRECCIÓN: la carpeta se llama Modelo (con mayúscula y en singular)
const usuariosModelo = require('../Modelo/usuarios');
const {
    validarNombre,
    validarCorreo,
    validarBoleta,
    validarContrasena,
    validarId,
} = require('../validaciones');

function responderError(res, error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un usuario con esa boleta o ese correo' });
    }
    console.error(error);
    return res.status(500).json({ error: 'No se pudo completar la operación en la base de datos' });
}

async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuariosModelo.listar();
        res.json(usuarios);
    } catch (error) {
        responderError(res, error);
    }
}

async function obtenerUsuario(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: 'El id del usuario no es válido' });
    try {
        const usuario = await usuariosModelo.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        responderError(res, error);
    }
}

async function crearUsuario(req, res) {
    const { nombre, correo, boleta, contrasena, rol } = req.body || {};

    if (!nombre || !correo || !boleta || !contrasena) {
        return res.status(400).json({
            error: 'nombre, correo, boleta y contraseña son obligatorios, favor de verificar los datos'
        });
    }
    if (!validarNombre(nombre)) return res.status(400).json({ error: 'El nombre debe tener entre 3 y 100 caracteres' });
    if (!validarCorreo(correo)) return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    if (!validarBoleta(boleta)) return res.status(400).json({ error: 'La boleta debe tener 10 dígitos' });
    if (!validarContrasena(contrasena)) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    if (rol !== undefined && !['alumno', 'admin'].includes(rol)) {
        return res.status(400).json({ error: 'El rol debe ser alumno o admin' });
    }

    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuario = await usuariosModelo.crear({ nombre, correo, contrasenaHash, boleta, rol });
        res.status(201).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
}

async function actualizarUsuario(req, res) {
    const { nombre, correo, rol } = req.body || {};

    if (nombre === undefined && correo === undefined && rol === undefined) {
        return res.status(400).json({
            error: 'Debe ingresar alguno de los siguientes datos para actualizar: nombre, correo o rol'
        });
    }
    if (nombre !== undefined && !validarNombre(nombre)) {
        return res.status(400).json({ error: 'El nombre debe tener entre 3 y 100 caracteres' });
    }
    if (correo !== undefined && !validarCorreo(correo)) {
        return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    if (rol !== undefined && !['alumno', 'admin'].includes(rol)) {
        return res.status(400).json({ error: 'El rol debe ser alumno o admin' });
    }
    if (!validarId(req.params.id)) return res.status(400).json({ error: 'El id del usuario no es válido' });
    try {
        const usuario = await usuariosModelo.actualizar(req.params.id, { nombre, correo, rol });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
}

async function eliminarUsuario(req, res) {
    if (!validarId(req.params.id)) return res.status(400).json({ error: 'El id del usuario no es válido' });
    try {
        const eliminado = await usuariosModelo.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = { listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario };
