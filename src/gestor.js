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
    const datos = this.almacen.leer();
    datos.ultimoId += 1;
    tarea.id = datos.ultimoId;
    datos.tareas.push(tarea);
    this.almacen.guardar(datos);
    return { ...tarea };
  }

  listar({ estado } = {}) {
    const { tareas } = this.almacen.leer();
    if (estado === undefined) return tareas;
    v.validarEstado(estado);
    return tareas.filter((t) => t.estado === estado);
  }

  obtener(id) {
    v.validarId(id);
    const tarea = this.almacen.leer().tareas.find((t) => t.id === id);
    if (!tarea) throw new ErrorNoEncontrado(id);
    return tarea;
  }

  cambiarEstado(id, estado) {
    v.validarId(id);
    v.validarEstado(estado);
    const datos = this.almacen.leer();
    const tarea = datos.tareas.find((t) => t.id === id);
    if (!tarea) throw new ErrorNoEncontrado(id);
    if (tarea.estado === "completada") {
      throw new ErrorEstado(`La tarea ${id} ya está completada y no puede cambiar de estado`);
    }
    tarea.estado = estado;
    this.almacen.guardar(datos);
    return { ...tarea };
  }

  eliminar(id) {
    v.validarId(id);
    const datos = this.almacen.leer();
    const indice = datos.tareas.findIndex((t) => t.id === id);
    if (indice === -1) throw new ErrorNoEncontrado(id);
    const [eliminada] = datos.tareas.splice(indice, 1);
    this.almacen.guardar(datos);
    return eliminada;
  }
}

module.exports = { GestorTareas };
