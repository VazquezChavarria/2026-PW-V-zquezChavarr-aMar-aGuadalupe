// Convierte 'AAAA-MM-DD' (o 'AAAA-MM-DDTHH:mm...') en una fecha LOCAL.
// new Date('2026-10-26') se interpreta como UTC y en México mostraría el 25 de octubre.
function aFechaLocal(fecha) {
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';
  const d = aFechaLocal(fecha);
  if (Number.isNaN(d.getTime())) return String(fecha);
  return d.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// true si el día del taller ya quedó atrás (hoy todavía cuenta como próximo).
export function yaPaso(fecha) {
  if (!fecha) return false;
  const d = aFechaLocal(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return d < hoy;
}

// La boleta es un dato personal: 2026090001 -> ******0001
export function ocultarBoleta(boleta) {
  const texto = String(boleta || '');
  return `******${texto.slice(-4)}`;
}
