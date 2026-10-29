// Mismas reglas que valida el backend.
export function validarBoleta(boleta) {
  return /^\d{10}$/.test(String(boleta));
}

export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo));
}

export function validarContrasena(contrasena) {
  return String(contrasena).length >= 8;
}
