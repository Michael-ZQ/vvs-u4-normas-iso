const { ErrorNoEncontrado, ErrorEstado } = require("./errores");
const v = require("./validacion");

// Reglas del negocio: crear, consultar, cambiar estado y eliminar tareas.
class GestorTareas {
  constructor(almacen) {
    this.almacen = almacen;
  }

  crear({ titulo, descripcion, prioridad } = {}) {
    const tarea = {
      titulo: v.validarTitulo(titulo),
      descripcion: v.validarDescripcion(descripcion),
      prioridad: v.validarPrioridad(prioridad),
      estado: "pendiente",
    };
    const tareas = this.almacen.leer();
    tarea.id = siguienteId(tareas);
    tareas.push(tarea);
    this.almacen.guardar(tareas);
    return { ...tarea };
  }

  listar({ estado } = {}) {
    const tareas = this.almacen.leer();
    if (estado === undefined) return tareas;
    v.validarEstado(estado);
    return tareas.filter((t) => t.estado === estado);
  }

  obtener(id) {
    v.validarId(id);
    const tarea = this.almacen.leer().find((t) => t.id === id);
    if (!tarea) throw new ErrorNoEncontrado(id);
    return tarea;
  }

  cambiarEstado(id, estado) {
    v.validarId(id);
    v.validarEstado(estado);
    const tareas = this.almacen.leer();
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) throw new ErrorNoEncontrado(id);
    if (tarea.estado === "completada") {
      throw new ErrorEstado(`La tarea ${id} ya está completada y no puede cambiar de estado`);
    }
    tarea.estado = estado;
    this.almacen.guardar(tareas);
    return { ...tarea };
  }

  eliminar(id) {
    v.validarId(id);
    const tareas = this.almacen.leer();
    const indice = tareas.findIndex((t) => t.id === id);
    if (indice === -1) throw new ErrorNoEncontrado(id);
    const [eliminada] = tareas.splice(indice, 1);
    this.almacen.guardar(tareas);
    return eliminada;
  }
}

function siguienteId(tareas) {
  return tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

module.exports = { GestorTareas };
