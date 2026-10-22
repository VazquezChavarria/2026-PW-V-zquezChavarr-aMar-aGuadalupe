// Funciones que validan correo, boleta y contraseña

// Correo: algo@dominio.ext, sin espacios
function validarCorreo(correo) {
    if (typeof correo !== 'string') return false;
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(correo.trim());
}

// Boleta: exactamente 10 dígitos (el controlador manda ese mensaje de error)
function validarBoleta(boleta) {
    if (typeof boleta !== 'string' && typeof boleta !== 'number') return false;
    return /^\d{10}$/.test(String(boleta).trim());
}

// Contraseña: mínimo 8 caracteres
function validarContrasena(contrasena) {
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = { validarCorreo, validarBoleta, validarContrasena };
