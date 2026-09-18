const talleres =[
    { nombre: 'Introduccion a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
    { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
    { nombre: 'Diseño de bases de datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
    { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

console.log("Aplicando forEach para imprimir los talleres:");
talleres.forEach((t) => console.log(`- ${t.nombre}(${t.inscritos}/${t.cupo})`));


console.log("Aplicando función Map con solo Nombres")
const nombre = talleres.map ((t) => t.nombre);
console.log(nombres);


console.log("Aplicando la función Filter en los talleres")
const llenos = talleres.filter((t) => t.inscritos >= t.cupo);