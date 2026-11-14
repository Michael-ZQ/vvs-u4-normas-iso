const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { AlmacenJSON } = require("../src/almacen");
const { GestorTareas } = require("../src/gestor");

// Cada prueba trabaja en su propia carpeta temporal (plan de pruebas, sección 3).
function nuevoEntorno(contenidoInicial) {
  const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), "vvs-u4-"));
  const ruta = path.join(carpeta, "tareas.json");
  if (contenidoInicial !== undefined) {
    fs.writeFileSync(ruta, contenidoInicial, "utf8");
  }
  const avisos = [];
  const crearGestor = () =>
    new GestorTareas(new AlmacenJSON(ruta, { avisar: (m) => avisos.push(m) }));
  return {
    carpeta,
    ruta,
    avisos,
    gestor: crearGestor(),
    crearGestor,
    leerArchivo: () => fs.readFileSync(ruta, "utf8"),
    archivos: () => fs.readdirSync(carpeta),
  };
}

module.exports = { nuevoEntorno };
