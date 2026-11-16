# Backend de talleres

El frontend funciona de inmediato con el backend de práctica que usa datos de ejemplo en memoria. No requiere instalar MySQL ni configurar credenciales.

## Iniciar la aplicación

Abre dos terminales desde la raíz del repositorio.

En la primera, inicia el backend:

```powershell
Set-Location 'SegundoParcial\actividad-autonoma-front\backend-memoria'
npm start
```

La API escucha en `http://localhost:3001`. Comprueba que responda abriendo esa dirección: debe devolver un JSON de estado.

En la segunda terminal, inicia el frontend:

```powershell
Set-Location 'SegundoParcial\MiniProyecto\PrimerProyecto\primerproyecto'
npm run dev
```

Abre `http://localhost:3000`. Next.js reenvía `/api/*` al backend del puerto `3001`. Las inscripciones de práctica se guardan en memoria y se reinician al apagar el servidor.

## Backend con MySQL (opcional)

`ExpressProyecto` contiene la implementación para guardar los datos en MySQL:

1. Ejecuta `schema.sql` en MySQL Workbench para crear la base `cecyt9_local`, sus tablas y talleres iniciales.
2. Desde `SegundoParcial\ExpressProyecto`, copia `..\.env.example` a `.env` y configura las credenciales de un usuario MySQL que pueda usar esa base. No compartas ni subas el archivo `.env`.
3. Inicia el servidor con `npm start`; la API MySQL escucha en `http://localhost:4000`.

No uses las dos APIs al mismo tiempo con los mismos endpoints. El frontend apunta al backend en memoria del puerto `3001`; para usar la base de MySQL, cambia el destino `/api/*` en `MiniProyecto\PrimerProyecto\primerproyecto\next.config.mjs` a `http://localhost:4000` y vuelve a iniciar Next.js.

## Rutas del frontend

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/talleres` | Lista talleres |
| GET | `/api/talleres/:id` | Consulta el detalle |
| GET | `/api/talleres/:id/asistencias` | Lista inscripciones |
| POST | `/api/asistencias` | Inscribe con `taller_id`, `nombre_alumno` y `boleta` |
| GET | `/api/usuarios` | Lista perfiles públicos |
