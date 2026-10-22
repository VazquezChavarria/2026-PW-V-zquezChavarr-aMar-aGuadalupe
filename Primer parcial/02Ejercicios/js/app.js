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

//ejercicios de objetos 

const formObjetos = document.getElementById('form-objetos');
const resultadoObjetos = document.getElementById('resultado-objetos');

formObjetos.addEventListener('submit', (evento) => {
    evento.preventDefault();

    //necesitamos construir el objeto de taller
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
        case 'stringify':
            const textoJson = JSON.stringify(taller, null, 2);
            resultado = `${textoJson}\n \n Tipo: ${typeof textoJson}`;
            break;
        case 'roundtrip':
            const textoJsons = JSON.stringify(taller, null, 2);
            const objetoDeVuelta = JSON.parse(textoJsons);

            resultado = [
                textoJsons,
                '',
                `${typeof objetoDeVuelta}`,
                objetoDeVuelta.nombre
            ].join('\n');
            break;
    }
<<<<<<< HEAD
    resultadoObjetos.textContent = resultado; 
=======
    resultadoObjetos.textContent = resultado;
>>>>>>> 55a5491a0f28e737ecf0b6d8a5c46010c18548a8
});