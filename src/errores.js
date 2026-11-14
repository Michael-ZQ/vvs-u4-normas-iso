// Errores propios del gestor: cada uno tiene un código para que la interfaz
// pueda mostrar un mensaje claro sin depender del texto.

class ErrorValidacion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.codigo = "VALIDACION";
  }
}

class ErrorNoEncontrado extends Error {
  constructor(id) {
    super(`No existe una tarea con id ${id}`);
    this.name = "ErrorNoEncontrado";
    this.codigo = "NO_ENCONTRADO";
  }
}

class ErrorEstado extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ErrorEstado";
    this.codigo = "ESTADO";
  }
}

module.exports = { ErrorValidacion, ErrorNoEncontrado, ErrorEstado };
