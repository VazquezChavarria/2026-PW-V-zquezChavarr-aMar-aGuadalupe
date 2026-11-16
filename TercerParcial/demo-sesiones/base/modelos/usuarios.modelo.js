// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
  // Regresa el usuario (sin el hash) si la contraseña es correcta, o null si no.
  async function verificar(usuario, contrasena) {
    // El ? evita la inyección SQL: MySQL recibe el valor aparte, nunca como parte de la consulta.
    const [filas] = await pool.query(
      'SELECT id, usuario, nombre, rol, contrasena_hash FROM usuarios WHERE usuario = ?',
      [String(usuario || '')]
    );
    const fila = filas[0];
    if (!fila) return null;

    // bcrypt.compare compara la contraseña escrita contra el hash; la contraseña nunca se guarda en texto plano.
    const coincide = await bcrypt.compare(String(contrasena || ''), fila.contrasena_hash);
    if (!coincide) return null;

    // Se devuelve sin contrasena_hash para que nunca viaje ni se guarde en la sesión.
    return { id: fila.id, usuario: fila.usuario, nombre: fila.nombre, rol: fila.rol };
  }

  return { verificar };
}

module.exports = { crearModeloUsuarios };
