// CORRECCIÓN: el paquete instalado es bcryptjs (no bcrypt)
const bcrypt = require('bcryptjs');
// CORRECCIÓN: la carpeta se llama Modelo (con mayúscula y en singular)
const usuariosModelo = require('../Modelo/usuarios');
const { validarCorreo, validarBoleta, validarContrasena } = require('../validaciones');

// ¿Se duplicó el correo o la boleta?
function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function listarUsuarios(req, res) {
    try {
        // CORRECCIÓN: el modelo exporta listar(), no obtenerTodos()
        const usuarios = await usuariosModelo.listar();
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
            error: 'nombre, correo, boleta y contraseña son obligatorios, favor de verificar los datos'
        });
    }
    if (!validarCorreo(correo)) return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    if (!validarBoleta(boleta)) return res.status(400).json({ error: 'La boleta debe tener 10 dígitos' });
    if (!validarContrasena(contrasena)) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });

    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        // CORRECCIÓN: el modelo recibe UN objeto, no argumentos sueltos
        const usuario = await usuariosModelo.crear({ nombre, correo, contrasenaHash, boleta, rol });
        res.status(201).json(usuario);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ error: 'Ya existe un usuario con esa boleta o ese correo' });
        }
        res.status(500).json({ error: error.message });
    }
}

async function actualizarUsuario(req, res) {
    const { nombre, correo, rol } = req.body;

    // CORRECCIÓN: debe mandar al menos UNO de los tres campos (antes solo fallaba si venían los tres)
    if (nombre === undefined && correo === undefined && rol === undefined) {
        return res.status(400).json({
            error: 'Debe ingresar alguno de los siguientes datos para actualizar: nombre, correo o rol'
        });
    }
    if (correo !== undefined && !validarCorreo(correo)) {
        return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    try {
        const usuario = await usuariosModelo.actualizar(req.params.id, { nombre, correo, rol });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        // CORRECCIÓN: actualizar con éxito responde 200 (antes era 401, que significa "no autorizado")
        res.status(200).json(usuario);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese correo, ingresa uno diferente' });
        }
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
