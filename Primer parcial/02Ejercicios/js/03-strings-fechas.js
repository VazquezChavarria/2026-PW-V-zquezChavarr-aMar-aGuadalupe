// 03-strings-fechas.js
// Métodos de string más usados + el objeto Date — conecta con la validación
// de fecha (DD/MM/AAAA) de la semana 4.
// Se ejecuta con: node 03-strings-fechas.js

const entrada = '  María López  ';

// trim — quita los espacios sobrantes al inicio y al final
console.log('Ejemplo de uso de .trim()');
console.log(`"${entrada.trim()}"`);

// split — parte el resultado del trim en un arreglo, usando un separador (espacio)
console.log('\nEjemplo de split');
const partes = entrada.trim().split(' ');
console.log(partes);

// includes — indica si el texto contiene '@'
console.log('\nManejo de includes');
console.log('correo@cecyt9.ipn.mx'.includes('@'));

// replace y replaceAll — cambian '/' por '-'
console.log('\nManejo de replace / replaceAll');
console.log('05/09/2026'.replace('/', '-'));     // solo la primera '/'
console.log('05/09/2026'.replaceAll('/', '-'));  // todas las '/'

// template literals — mezclan texto y variables
console.log('\nUso de template literals');
const nombre = 'María';
const cupo = 25;
console.log(`${nombre} se inscribió en un taller con cupo para ${cupo} personas.`);

// Date — construye un Date a partir de 'DD/MM/AAAA' (los meses en Date empiezan en 0)
console.log('\nManejo de Date');
function fechaDesdeTexto(textoFecha) {
  const [dia, mes, anio] = textoFecha.split('/').map(Number);
  return new Date(anio, mes - 1, dia);
}

const fechaAsistencia = fechaDesdeTexto('05/09/2026');
console.log('Fecha construida:', fechaAsistencia.toISOString());
console.log('Día de la semana (0 = domingo):', fechaAsistencia.getDay());

const hoy = new Date();
const diasDeDiferencia = Math.round((fechaAsistencia - hoy) / (1000 * 60 * 60 * 24));
console.log(`Faltan ${diasDeDiferencia} día(s) para la fecha de asistencia (negativo si ya pasó).`);