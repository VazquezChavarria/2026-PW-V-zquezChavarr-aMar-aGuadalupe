const talleres = [
    { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
    { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
    { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
    { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

// forEach — imprime "- <nombre> (<inscritos>/<cupo>)" de cada taller
console.log('Aplicando forEach para imprimir los talleres:');
talleres.forEach((t) => console.log(`- ${t.nombre} (${t.inscritos}/${t.cupo})`));

// map — arreglo `nombres` solo con los nombres de los talleres
console.log('Aplicando la función map con solo nombres');
const nombres = talleres.map((t) => t.nombre);
console.log(nombres);

// filter — arreglo `llenos` con los talleres donde inscritos >= cupo
console.log('Aplicando la función filter en los talleres con cupo lleno');
const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
console.log(llenos);

// find — el PRIMER taller impartido por 'Ing. María López'
console.log('Aplicando la función find para buscar un taller por instructor');
const encontrado = talleres.find((t) => t.instructor === 'Ing. María López');
console.log(encontrado);

// reduce — `totalInscritos`, la suma de inscritos de todos los talleres
console.log('Aplicando la función reduce para sumar inscritos');
const totalInscritos = talleres.reduce((suma, t) => suma + t.inscritos, 0);
console.log(`Total de inscritos: ${totalInscritos}`);

// filter + map encadenados — nombres de los talleres que SÍ tienen cupo disponible
console.log('Encadenando filter + map: talleres con cupo disponible');
const conCupo = talleres
    .filter((t) => t.inscritos < t.cupo)
    .map((t) => t.nombre);
console.log(conCupo);