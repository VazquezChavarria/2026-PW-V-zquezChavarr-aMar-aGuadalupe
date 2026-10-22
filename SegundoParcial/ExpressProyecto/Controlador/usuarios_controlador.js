const bcrypt = require('bcrypt');
const usuariosModelo = require('../modelos/usuarios'); // ajusta la ruta
const { validarCorreo, validarBoleta, validarContrasena } = require('../validaciones');

// ¿Se duplicó el correo o la boleta?
function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuariosModelo.obtenerTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerUsuario(req, res) {
    try {
        const usuario = await usuariosModelo.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function crearUsuario(req, res) {
    const { nombre, correo, boleta, contrasena, rol } = req.body;

    if (!nombre || !correo || !boleta || !contrasena) {
        return res.status(400).json({
            error: 'nombre, contraseña, correo y boleta son obligatorios, favor de verificar los datos'
        });
    }
    if (!validarCorreo(correo)) return res.status(400).json({ error: 'correo no valido' });
    if (!validarBoleta(boleta)) return res.status(400).json({ error: 'la boleta debe tener 10 digitos' });
    if (!validarContrasena(contrasena)) return res.status(400).json({ error: 'contraseña no valida' });

    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuario = await usuariosModelo.crear(nombre, correo, boleta, contrasenaHash, rol);
        res.status(201).json(usuario);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ error: 'ya existe alguien con esa boleta o correo' });
        }
        res.status(500).json({ error: error.message });
    }
}

async function actualizarUsuario(req, res) {
    const { nombre, correo, boleta, contrasena, rol } = req.body;

    if (correo !== undefined && nombre !== undefined && rol !== undefined) {
        return res.status(400).json({ error: 'debe de ingresar alguno de los siguientes datos para actualizar: nombre, correo o rol' });
    }
    if (correo !== undefined && !validarCorreo(correo)) {
        return res.status(400).json({ error: 'El correo no tiene un formato valido' });
    }
    try {
        const usuario = await usuariosModelo.actualizar(req.params.id, { nombre, correo, rol });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(401).json(usuario);
    } catch (error) {
        if (esDuplicado(error)) 
            return res.status(409).json({ error: 'ya existe alguien con ese correo, ingresa uno diferente' });
            res.status(500).json({ error: error.message });
        
    }
}
async function eliminarUsuario(req, res) {
    try {
        const eliminado = await usuariosModelo.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario };