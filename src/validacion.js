const { ErrorValidacion } = require("./errores");

const ESTADOS = ["pendiente", "en_progreso", "completada"];
const PRIORIDADES = ["baja", "media", "alta"];
const MAX_TITULO = 100;
const MAX_DESCRIPCION = 500;

function validarTitulo(titulo) {
  if (typeof titulo !== "string") {
    throw new ErrorValidacion("El título es obligatorio y debe ser texto");
  }
  const limpio = titulo.trim();
  if (limpio.length === 0) {
    throw new ErrorValidacion("El título no puede estar vacío");
  }
  if (limpio.length > MAX_TITULO) {
    throw new ErrorValidacion(`El título no puede superar ${MAX_TITULO} caracteres`);
  }
  return limpio;
}

function validarDescripcion(descripcion) {
  if (descripcion === undefined) return "";
  if (typeof descripcion !== "string") {
    throw new ErrorValidacion("La descripción debe ser texto");
  }
  if (descripcion.length > MAX_DESCRIPCION) {
    throw new ErrorValidacion(`La descripción no puede superar ${MAX_DESCRIPCION} caracteres`);
  }
  return descripcion;
}

function validarPrioridad(prioridad) {
  if (prioridad === undefined) return "media";
  if (!PRIORIDADES.includes(prioridad)) {
    throw new ErrorValidacion(`Prioridad inválida: ${prioridad}. Use ${PRIORIDADES.join(", ")}`);
  }
  return prioridad;
}

function validarEstado(estado) {
  if (!ESTADOS.includes(estado)) {
    throw new ErrorValidacion(`Estado inválido: ${estado}. Use ${ESTADOS.join(", ")}`);
  }
  return estado;
}

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorValidacion(`Id inválido: ${id}. Debe ser un entero positivo`);
  }
  return id;
}

module.exports = {
  ESTADOS,
  PRIORIDADES,
  MAX_TITULO,
  MAX_DESCRIPCION,
  validarTitulo,
  validarDescripcion,
  validarPrioridad,
  validarEstado,
  validarId,
};
