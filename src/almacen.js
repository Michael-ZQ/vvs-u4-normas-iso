const fs = require("node:fs");
const path = require("node:path");
const { esTareaValida } = require("./validacion");

// Guarda y lee las tareas en un archivo JSON con la forma { ultimoId, tareas }.
// ultimoId recuerda el mayor id entregado, aunque esa tarea ya se haya eliminado (DEF-01).
class AlmacenJSON {
  constructor(ruta, { avisar = console.warn } = {}) {
    this.ruta = ruta;
    this.avisar = avisar;
  }

  leer() {
    if (!fs.existsSync(this.ruta)) {
      return vacio();
    }
    const contenido = fs.readFileSync(this.ruta, "utf8");
    try {
      return normalizar(JSON.parse(contenido));
    } catch (error) {
      return this.#recuperar(error);
    }
  }

  guardar({ ultimoId, tareas }) {
    fs.mkdirSync(path.dirname(this.ruta), { recursive: true });
    fs.writeFileSync(this.ruta, JSON.stringify({ ultimoId, tareas }, null, 2), "utf8");
  }

  // RNF-01: el archivo dañado no se borra; se renombra como respaldo y se empieza vacío.
  #recuperar(error) {
    const respaldo = `${this.ruta}.corrupto-${Date.now()}`;
    fs.renameSync(this.ruta, respaldo);
    this.avisar(
      `Aviso: ${path.basename(this.ruta)} estaba dañado (${error.message}). ` +
        `Se guardó una copia en ${path.basename(respaldo)} y se empezó una lista nueva.`
    );
    return vacio();
  }
}

function vacio() {
  return { ultimoId: 0, tareas: [] };
}

// Acepta el formato nuevo y el de la versión 1 (solo la lista de tareas).
function normalizar(datos) {
  const tareas = Array.isArray(datos) ? datos : datos?.tareas;
  if (!Array.isArray(tareas)) {
    throw new Error("el archivo no contiene una lista de tareas");
  }
  revisarTareas(tareas);
  const mayorId = tareas.reduce((max, t) => Math.max(max, t.id), 0);
  if (Array.isArray(datos)) {
    return { ultimoId: mayorId, tareas };
  }
  if (!Number.isInteger(datos.ultimoId) || datos.ultimoId < mayorId) {
    throw new Error("ultimoId no es válido");
  }
  return { ultimoId: datos.ultimoId, tareas };
}

function revisarTareas(tareas) {
  const indice = tareas.findIndex((t) => !esTareaValida(t));
  if (indice !== -1) {
    throw new Error(`la tarea en la posición ${indice + 1} no es válida`);
  }
  if (new Set(tareas.map((t) => t.id)).size !== tareas.length) {
    throw new Error("hay tareas con el mismo id");
  }
}

module.exports = { AlmacenJSON };
