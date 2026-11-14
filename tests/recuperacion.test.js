const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { nuevoEntorno } = require("./ayuda");

function comprobarRecuperacion(contenidoDanado) {
  const entorno = nuevoEntorno(contenidoDanado);
  const { gestor, avisos, archivos, carpeta } = entorno;

  // No se cae y empieza con una lista vacía.
  assert.deepEqual(gestor.listar(), []);

  // Avisa y conserva el archivo dañado como respaldo.
  assert.equal(avisos.length, 1);
  assert.match(avisos[0], /dañado/);
  const respaldos = archivos().filter((a) => a.startsWith("tareas.json.corrupto-"));
  assert.equal(respaldos.length, 1);
  assert.equal(fs.readFileSync(path.join(carpeta, respaldos[0]), "utf8"), contenidoDanado);

  // Sigue funcionando.
  const nueva = gestor.crear({ titulo: "Después del fallo" });
  assert.equal(nueva.id, 1);
  assert.deepEqual(gestor.listar(), [nueva]);
}

test("CR-01 archivo que no es JSON", () => {
  comprobarRecuperacion("esto no es json {");
});

test("CR-02 JSON válido que no es una lista", () => {
  comprobarRecuperacion('{"a":1}');
});

test("CR-03 lista con elementos mal formados", () => {
  comprobarRecuperacion('[{"titulo":"x"}, 5]');
});

// Regresión de DEF-02: otra forma de archivo dañado que da ids ambiguos.
test("CR-03b lista con dos tareas del mismo id", () => {
  const tarea = { id: 1, titulo: "x", descripcion: "", prioridad: "media", estado: "pendiente" };
  comprobarRecuperacion(JSON.stringify([tarea, { ...tarea, titulo: "y" }]));
});
