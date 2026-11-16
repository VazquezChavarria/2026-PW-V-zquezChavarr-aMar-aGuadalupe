function validarNombre(nombre) {
    return typeof nombre === 'string' && nombre.trim().length >= 3 && nombre.trim().length <= 100;
}

function validarCorreo(correo) {
    return typeof correo === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function validarBoleta(boleta) {
    return typeof boleta === 'string' && /^\d{10}$/.test(boleta.trim());
}

function validarContrasena(contrasena) {
    return typeof contrasena === 'string' && contrasena.length >= 8;
}

function validarCupo(cupo) {
    const numero = Number(cupo);
    return Number.isInteger(numero) && numero >= 1 && numero <= 500;
}

function validarId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
}

module.exports = {
    validarNombre,
    validarCorreo,
    validarBoleta,
    validarContrasena,
    validarCupo,
    validarId,
};
