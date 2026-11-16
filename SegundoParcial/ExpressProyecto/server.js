require('dotenv').config();

const express = require('express');

const app = express();
const PORT = 4000;

app.use(express.json({ limit: '10kb' }));

app.get('/Saludo', (req, res) => {
    res.json({message: 'Hola, esto es una prueba en GET'});
});

app.get('/saludo', (req, res) => {
    res.json({message: 'Hola, esto es una prueba en GET'});
});

app.post('/eco', (req, res) => {
    const {texto} = req.body;
    if (typeof texto !== 'string' || !texto.trim()) {
        return res.status(400).json({error: 'El texto es obligatorio'});
    }
    res.status(201).json({eco: texto.trim()});
});

app.get('/', (req, res) => {
    res.json({message: 'API de talleres disponible'});
});

const usuarios = require('./Controlador/usuarios_controlador');
const talleres = require('./Controlador/talleres_controlador');
const asistencias = require('./Controlador/asistencias_controlador');

app.get('/api/usuarios', usuarios.listarUsuarios);
app.get('/api/usuarios/:id', usuarios.obtenerUsuario);
app.post('/api/usuarios', usuarios.crearUsuario);
app.put('/api/usuarios/:id', usuarios.actualizarUsuario);
app.delete('/api/usuarios/:id', usuarios.eliminarUsuario);

app.get('/api/talleres', talleres.listarTalleres);
app.get('/api/talleres/:id/asistencias', asistencias.listarPorTaller);
app.get('/api/talleres/:id', talleres.consultarPorTaller);
app.post('/api/asistencias', asistencias.inscribir);

// Se conservan las rutas del ejercicio de Express del segundo parcial.
app.get('/usuarios', usuarios.listarUsuarios);
app.get('/usuarios/:id', usuarios.obtenerUsuario);
app.get('/talleres', talleres.listarTalleres);
app.get('/talleres/:id', talleres.consultarPorTaller);
app.post('/talleres/registrarse', talleres.registrarseEnUnTaller);
app.post('/usuarios', usuarios.crearUsuario);
app.post('/asistencias', asistencias.registrarAsistenciaEnElTaller);
app.get('/asistencias', asistencias.consultarListaDeAsistencias);
app.put('/usuarios/:id', usuarios.actualizarUsuario);
app.delete('/usuarios/:id', usuarios.eliminarUsuario);

app.use((req, res) => res.status(404).json({error: 'Ruta no encontrada'}));

app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({error: 'El cuerpo de la petición no contiene JSON válido'});
    }
    console.error(error);
    res.status(500).json({error: 'Error interno del servidor'});
});

const puerto = Number(process.env.PORT || PORT);
app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});