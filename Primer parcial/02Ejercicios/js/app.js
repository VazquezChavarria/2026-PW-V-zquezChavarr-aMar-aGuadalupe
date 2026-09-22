function pintarTabla(){
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