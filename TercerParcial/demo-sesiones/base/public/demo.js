// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id);

// ETAPA 1 · llamar
// Una sola función para todas las peticiones: así el manejo del código y del JSON está en un solo lugar
// y el resto del código solo se preocupa de pintar. Regresa { status, datos }.
// fetch NO lanza error con un 401 o 403 (solo falla si no hay red), por eso el código se lee de respuesta.status.
// El encabezado Content-Type solo se manda cuando hay cuerpo: sin él, express.json() no lee el JSON.
// No usamos credentials: 'include' porque la página y la API están en el mismo origen (mismo puerto);
// haría falta si el frontend estuviera en otro puerto (por ejemplo Next.js en 3000 y la API en 4600).
async function llamar(metodo, url, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(cuerpo);
  }
  const respuesta = await fetch(url, opciones);
  let datos = null;
  try {
    datos = await respuesta.json();
  } catch (error) {
    // Si el servidor contestó algo que no es JSON, preferimos datos = null a que la página truene.
    datos = null;
  }
  return { status: respuesta.status, datos };
}

// ETAPA 2 · bitácora
// Deja un registro visible de cada petición para poder ver, sin abrir F12, qué código regresó el servidor.
// Usamos textContent (no innerHTML) porque el JSON puede traer texto escrito por alguien (un nombre, por ejemplo):
// con innerHTML un script metido ahí se ejecutaría (XSS) y, si la cookie no fuera httpOnly, podría robarla.
function clasePorCodigo(status) {
  if (status >= 200 && status < 300) return 'ok';
  if (status === 401) return 'e401';
  if (status === 403) return 'e403';
  return 'error';
}

function anotarEnBitacora(metodo, url, status, datos) {
  const item = document.createElement('li');

  const codigo = document.createElement('span');
  codigo.className = `codigo ${clasePorCodigo(status)}`;
  codigo.textContent = status;

  const ruta = document.createElement('span');
  ruta.textContent = ` ${metodo} ${url}`;

  const json = document.createElement('pre');
  json.textContent = JSON.stringify(datos, null, 2);

  item.append(codigo, ruta, json);
  $('bitacora').prepend(item); // prepend: lo más nuevo queda arriba
}

// ETAPA 3 · estado
// Le preguntamos al servidor quién cree que somos, en lugar de suponerlo: la verdad vive en el servidor.
// #cookie-js sale vacío con httpOnly: true aunque estemos logueados, porque el JavaScript no puede leer esa cookie.
async function refrescarEstado() {
  const { status, datos } = await llamar('GET', '/api/sesion');
  const estado = $('estado');
  if (status === 200 && datos && datos.usuario) {
    estado.textContent =
      `${datos.usuario.nombre} (${datos.usuario.rol}) · sesión ${datos.sesion} · vence en ${datos.expiraEnSegundos} s`;
    estado.className = 'estado con-sesion';
  } else {
    estado.textContent = `Sin sesión (el servidor responde ${status})`;
    estado.className = 'estado sin-sesion';
  }
  $('cookie-js').textContent = document.cookie || '(vacío)';
}

// ETAPA 4 · tabla de sesiones del servidor
// Vaciamos el tbody antes de llenarlo; si no, cada clic agregaría filas repetidas.
// La fecha llega como texto ISO, por eso la convertimos a hora local legible.
async function refrescarTabla() {
  const { status, datos } = await llamar('GET', '/api/diagnostico/sesiones');
  const cuerpo = $('tabla-sesiones');
  cuerpo.replaceChildren();

  if (status !== 200 || !datos) {
    $('donde').textContent = `No se pudo leer el servidor (código ${status})`;
    agregarFilaVacia(cuerpo, '(error al leer las sesiones)');
    return;
  }

  $('donde').textContent =
    datos.almacen === 'mysql'
      ? 'En MySQL, tabla sessions: sobreviven a un reinicio del servidor'
      : 'En la memoria del servidor: se pierden al reiniciarlo';

  if (!datos.sesiones || datos.sesiones.length === 0) {
    agregarFilaVacia(cuerpo, '(sin sesiones)');
    return;
  }

  for (const s of datos.sesiones) {
    const fila = document.createElement('tr');
    if (s.esLaTuya) fila.className = 'tuya';
    const vence = s.expira ? new Date(s.expira).toLocaleTimeString() : '—';
    const valores = [s.esLaTuya ? `${s.sesion} (la tuya)` : s.sesion, s.usuario, s.visitas, vence];
    for (const valor of valores) {
      const celda = document.createElement('td');
      celda.textContent = valor; // textContent por la misma razón que en la bitácora
      fila.append(celda);
    }
    cuerpo.append(fila);
  }
}

function agregarFilaVacia(cuerpo, texto) {
  const fila = document.createElement('tr');
  const celda = document.createElement('td');
  celda.colSpan = 4;
  celda.textContent = texto;
  fila.append(celda);
  cuerpo.append(fila);
}

// Después de cada acción refrescamos estado y tabla juntos para que la pantalla nunca muestre datos viejos.
async function refrescarTodo() {
  await Promise.all([refrescarEstado(), refrescarTabla()]);
}

// ETAPA 5 · eventos
// Una acción = llamar, anotar en la bitácora y refrescar la pantalla.
async function hacerYAnotar(metodo, url, cuerpo) {
  const { status, datos } = await llamar(metodo, url, cuerpo);
  anotarEnBitacora(metodo, url, status, datos);
  await refrescarTodo();
}

// preventDefault evita que el formulario recargue la página (que es lo que hace un submit normal).
$('form-login').addEventListener('submit', (evento) => {
  evento.preventDefault();
  hacerYAnotar('POST', '/api/login', {
    usuario: $('usuario').value,
    contrasena: $('contrasena').value,
  });
});

// Al cambiar de usuario se pone su contraseña de ejemplo para no tener que escribirla cada vez.
$('usuario').addEventListener('change', () => {
  $('contrasena').value = `${$('usuario').value}12345`;
});

// En vez de un addEventListener por botón, recorremos todos los que traen data-url y leemos dataset.
document.querySelectorAll('button[data-url]').forEach((boton) => {
  boton.addEventListener('click', () => {
    hacerYAnotar(boton.dataset.metodo, boton.dataset.url);
  });
});

$('btn-refrescar').addEventListener('click', refrescarTodo);
$('btn-sesiones').addEventListener('click', refrescarTabla);

// ETAPA 6 · al cargar la página
// No hace falta esperar DOMContentLoaded: el <script> está al final del <body>, así que el HTML ya existe.
// La configuración y el refresco van por separado para que, si una petición se tarda o falla, la otra igual se pinte.
async function cargarConfiguracion() {
  const { datos } = await llamar('GET', '/api/config');
  $('config').textContent = JSON.stringify(datos, null, 2);
}

cargarConfiguracion();
refrescarTodo();