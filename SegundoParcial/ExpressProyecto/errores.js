// Error "esperado" de la lógica del negocio (taller lleno, alumno ya inscrito, etc.).
// Lleva el código HTTP que el controlador debe responder.
class ErrorNegocio extends Error {
    constructor(codigo, mensaje, estado = 400) {
        super(mensaje);
        this.name = 'ErrorNegocio';
        this.codigo = codigo;
        this.estado = estado;
    }
}

// Responde al cliente según el tipo de error:
// - ErrorNegocio -> el código HTTP que trae (404, 409, ...)
// - cualquier otro -> 500
function responderError(res, error) {
    if (error instanceof ErrorNegocio) {
        return res.status(error.estado).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
}

module.exports = { ErrorNegocio, responderError };
