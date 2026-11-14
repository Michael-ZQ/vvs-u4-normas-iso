const fs = require("node:fs");
const path = require("node:path");
const { esTareaValida } = require("./validacion");

// Guarda y lee la lista de tareas en un archivo JSON.
class AlmacenJSON {
  constructor(ruta, { avisar = console.warn } = {}) {
    this.ruta = ruta;
    this.avisar = avisar;
  }

  leer() {
    if (!fs.existsSync(this.ruta)) {
      return [];
    }
    const contenido = fs.readFileSync(this.ruta, "utf8");
    try {
      const datos = JSON.parse(contenido);
      if (!Array.isArray(datos)) {
        throw new Error("el archivo no contiene una lista de tareas");
      }
      revisarTareas(datos);
      return datos;
    } catch (error) {
      return this.#recuperar(error);
    }
  }

  guardar(tareas) {
    fs.mkdirSync(path.dirname(this.ruta), { recursive: true });
    fs.writeFileSync(this.ruta, JSON.stringify(tareas, null, 2), "utf8");
  }

  // RNF-01: el archivo dañado no se borra; se renombra como respaldo y se empieza vacío.
  #recuperar(error) {
    const respaldo = `${this.ruta}.corrupto-${Date.now()}`;
    fs.renameSync(this.ruta, respaldo);
    this.avisar(
      `Aviso: ${path.basename(this.ruta)} estaba dañado (${error.message}). ` +
        `Se guardó una copia en ${path.basename(respaldo)} y se empezó una lista nueva.`
    );
    return [];
  }
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
