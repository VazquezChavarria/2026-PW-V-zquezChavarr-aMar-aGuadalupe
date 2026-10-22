// ============================================================
// 1. ARREGLOS  (usa la lista `talleres` de 01-arreglos.js)
// ============================================================
function pintarTabla() {
    // Obtiene el <tbody> de la tabla y lo llena con los datos de talleres
    const tbody = document.querySelector('.tabla-talleres tbody');
    tbody.innerHTML = '';

    talleres.forEach((t) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${t.nombre}</td>
            <td>${t.instructor}</td>
            <td>${t.cupo}</td>
            <td>${t.inscritos}</td>
        `;
        tbody.appendChild(fila);
    });
}

const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');
const inputBuscarInstructor = document.getElementById('buscar-instructor');

// Muestra el campo de búsqueda solo cuando se elige "find"
selectOperacionArreglo.addEventListener('change', () => {
    inputBuscarInstructor.style.display = selectOperacionArreglo.value === 'find' ? 'inline-block' : 'none';
});

formArreglos.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch (operacion) {
        case 'forEach':
            resultado = talleres
                .map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`)
                .join('\n');
            break;

        case 'map':
            resultado = talleres
                .map((t) => t.nombre)
                .join('\n');
            break;

        case 'filter':
            resultado = talleres
                .filter((t) => t.inscritos >= t.cupo)
                .map((t) => `- ${t.nombre} (lleno: ${t.inscritos}/${t.cupo})`)
                .join('\n');
            break;

        case 'find': {
            const buscado = inputBuscarInstructor.value.trim().toLowerCase();
            const encontrado = talleres.find((t) => t.instructor.toLowerCase().includes(buscado));
            resultado = encontrado
                ? `- ${encontrado.nombre} (Instructor: ${encontrado.instructor})`
                : 'No se encontró ningún taller con ese instructor.';
            break;
        }

        default:
            resultado = '';
    }

    resultadoArreglos.textContent = resultado;
});

// Pinta la tabla apenas carga la página
pintarTabla();

// ============================================================
// 2. OBJETOS Y JSON
// ============================================================
const formObjetos = document.getElementById('form-objetos');
// CORRECCIÓN: el id en el HTML es "resultado-objeto" (sin "s" al final)
const resultadoObjetos = document.getElementById('resultado-objeto');

formObjetos.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Construimos el objeto de taller con lo que escribió el usuario
    const taller = {
        nombre: document.getElementById('obj-nombre').value,
        instructor: document.getElementById('obj-instructor').value,
        cupo: Number(document.getElementById('obj-cupo').value),
        inscritos: Number(document.getElementById('obj-inscritos').value)
    };
    const operacion = document.getElementById('operacion-objeto').value;

    let resultado;

    switch (operacion) {
        case 'keys':
            resultado = JSON.stringify(Object.keys(taller));
            break;
        case 'values':
            resultado = JSON.stringify(Object.values(taller));
            break;
        case 'entries':
            resultado = JSON.stringify(Object.entries(taller));
            break;
        case 'stringify': {
            const textoJson = JSON.stringify(taller, null, 2);
            resultado = `${textoJson}\n\nTipo: ${typeof textoJson}`;
            break;
        }
        case 'roundtrip': {
            const textoJson = JSON.stringify(taller, null, 2);
            const objetoDeVuelta = JSON.parse(textoJson);
            resultado = [
                textoJson,
                '',
                `Tipo de vuelta: ${typeof objetoDeVuelta}`,
                `Nombre: ${objetoDeVuelta.nombre}`
            ].join('\n');
            break;
        }
        default:
            resultado = '';
    }

    // CORRECCIÓN: se eliminaron las marcas de conflicto de git (<<<<<<< HEAD / ======= / >>>>>>>)
    resultadoObjetos.textContent = resultado;
});

// ============================================================
// 3. STRINGS Y FECHAS  (sección nueva)
// ============================================================
const formTexto = document.getElementById('form-texto');
const resultadoTexto = document.getElementById('resultado-texto');
const errorFecha = document.getElementById('error-fecha');

// Construye un Date a partir de 'DD/MM/AAAA' (los meses en Date empiezan en 0)
function fechaDesdeTexto(textoFecha) {
    const [dia, mes, anio] = textoFecha.split('/').map(Number);
    return new Date(anio, mes - 1, dia);
}

formTexto.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const entrada = document.getElementById('nombre-entrada').value;
    const cupoTexto = document.getElementById('cupo-entrada').value;
    const textoFecha = document.getElementById('fecha-entrada').value.trim();

    // Validación de fecha con expresión regular DD/MM/AAAA
    const patronFecha = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!patronFecha.test(textoFecha)) {
        errorFecha.textContent = 'La fecha debe tener el formato DD/MM/AAAA';
        resultadoTexto.textContent = '';
        return;
    }
    const fecha = fechaDesdeTexto(textoFecha);
    // Detecta fechas imposibles como 31/02/2026
    const [dia, mes, anio] = textoFecha.split('/').map(Number);
    if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
        errorFecha.textContent = 'Esa fecha no existe en el calendario';
        resultadoTexto.textContent = '';
        return;
    }
    errorFecha.textContent = '';

    const nombreLimpio = entrada.trim();
    const partes = nombreLimpio.split(' ');
    const hoy = new Date();
    const dias = Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));

    resultadoTexto.textContent = [
        `trim: "${nombreLimpio}"`,
        `split: ${JSON.stringify(partes)}`,
        `includes('@') en el nombre: ${entrada.includes('@')}`,
        `replace: ${textoFecha.replace('/', '-')}`,
        `replaceAll: ${textoFecha.replaceAll('/', '-')}`,
        `template literal: ${nombreLimpio} se inscribió en un taller con cupo para ${cupoTexto} personas.`,
        `Date (ISO): ${fecha.toISOString()}`,
        `Día de la semana (0 = domingo): ${fecha.getDay()}`,
        `Diferencia contra hoy: ${dias} día(s)`
    ].join('\n');
});
