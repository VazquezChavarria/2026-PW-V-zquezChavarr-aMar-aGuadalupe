const form = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', function(evento) {
    evento.preventDefault();

    form.classList.remove('registro-exitoso', 'registro-fallido');
    mensaje.classList.remove('mensaje-exitoso', 'mensaje-fallido');

    let esValido = true;

    form.querySelectorAll('input').forEach(function(input) {
        input.classList.remove('invalido');
        if (!input.checkValidity()) {
            input.classList.add('invalido');
            esValido = false;
        }
});

if (esValido) {
    form.classList.add('registro-exitoso');
    mensaje.textContent = 'Registro exitoso';
    mensaje.classList.add('mensaje-exitoso');
}else {
    form.classList.add('registro-fallido');
    mensaje.textContent = 'Por favor, revise los campos del formulario';
    mensaje.classList.add('mensaje-fallido');
}
});