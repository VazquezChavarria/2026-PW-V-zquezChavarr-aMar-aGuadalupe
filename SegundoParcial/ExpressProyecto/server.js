const express = require('express');

const app = express();

app.use(express.json());


const PORT = 4000;


//tenemos la ruta princiipal por medio del metodo get
app.get('/Saludo', (req, res) => {
    res.json({message: 'Hola, esto es una prueba en GET'});
});

//rutas por medio del metodo post, como un endpoint propio

app.post('/eco', (req, res) => {
    const {texto} = req.body;
    if(!texto){
        return res.status(400).json({error: 'El texto es obligatorio'});
    }
    res.status(201).json({eco: texto});
});
const usuarios = require('./Controlador/usuarios_controlador');

app.get('/usuarios', usuarios.listarUsuarios);
app.get('/usuarios/:id', usuarios.obtenerUsuario);
app.post('/usuarios', usuarios.crearUsuario);
app.put('/usuarios/:id', usuarios.actualizarUsuario);
app.delete('/usuarios/:id', usuarios.eliminarUsuario);

// talleres (con sus inscripciones) y asistencias
app.use('/talleres', require('./Rutas/talleres'));
app.use('/asistencias', require('./Rutas/asistencias'));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});