
const $ = (id) => document.getElementById(id);

// ETAPA 1 · llamar

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

    datos = null;
  }
  return { status: respuesta.status, datos };
}

// ETAPA 2 · bitácora
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
  $('bitacora').prepend(item);
}

// ETAPA 3 · estado

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
      celda.textContent = valor; 
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

async function refrescarTodo() {
  await Promise.all([refrescarEstado(), refrescarTabla()]);
}

// ETAPA 5 · eventos
async function hacerYAnotar(metodo, url, cuerpo) {
  const { status, datos } = await llamar(metodo, url, cuerpo);
  anotarEnBitacora(metodo, url, status, datos);
  await refrescarTodo();
}

$('form-login').addEventListener('submit', (evento) => {
  evento.preventDefault();
  hacerYAnotar('POST', '/api/login', {
    usuario: $('usuario').value,
    contrasena: $('contrasena').value,
  });
});

$('usuario').addEventListener('change', () => {
  $('contrasena').value = `${$('usuario').value}12345`;
});

document.querySelectorAll('button[data-url]').forEach((boton) => {
  boton.addEventListener('click', () => {
    hacerYAnotar(boton.dataset.metodo, boton.dataset.url);
  });
});

$('btn-refrescar').addEventListener('click', refrescarTodo);
$('btn-sesiones').addEventListener('click', refrescarTabla);

// ETAPA 6 · al cargar la página
async function cargarConfiguracion() {
  const { datos } = await llamar('GET', '/api/config');
  $('config').textContent = JSON.stringify(datos, null, 2);
}

cargarConfiguracion();
refrescarTodo();