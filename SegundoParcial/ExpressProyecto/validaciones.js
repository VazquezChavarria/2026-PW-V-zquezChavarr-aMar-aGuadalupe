// Funciones que validan correo, boleta, contraseña, ids, cupos, textos y fechas

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

// Id: entero positivo (acepta el número o el texto que llega en la URL, como "12")
function validarId(id) {
    if (typeof id !== 'number' && typeof id !== 'string') return false;
    if (typeof id === 'string' && !/^\d+$/.test(id.trim())) return false;
    const numero = Number(id);
    return Number.isInteger(numero) && numero > 0;
}

// Cupo: entero mayor a 0
function validarCupo(cupo) {
    if (typeof cupo !== 'number' && typeof cupo !== 'string') return false;
    if (typeof cupo === 'string' && !/^\d+$/.test(cupo.trim())) return false;
    const numero = Number(cupo);
    return Number.isInteger(numero) && numero > 0;
}

// Texto: cadena no vacía (sin contar espacios) de hasta `max` caracteres
function validarTexto(texto, max = 120) {
    if (typeof texto !== 'string') return false;
    const limpio = texto.trim();
    return limpio.length > 0 && limpio.length <= max;
}

// Fecha: formato AAAA-MM-DD y que exista en el calendario (rechaza 2026-02-31)
function validarFecha(fecha) {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const d = new Date(Date.UTC(anio, mes - 1, dia));
    return d.getUTCFullYear() === anio && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
}

module.exports = {
    validarCorreo,
    validarBoleta,
    validarContrasena,
    validarId,
    validarCupo,
    validarTexto,
    validarFecha,
};
