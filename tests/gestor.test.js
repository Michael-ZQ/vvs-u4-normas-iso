const { test } = require("node:test");
const assert = require("node:assert/strict");
const { nuevoEntorno } = require("./ayuda");
const { ErrorValidacion, ErrorNoEncontrado, ErrorEstado } = require("../src/errores");

// ---------- Positivos ----------

test("CP-01 crear una tarea válida con valores por defecto", () => {
  const { gestor, leerArchivo } = nuevoEntorno();
  const tarea = gestor.crear({ titulo: "  Leer norma  " });
  assert.deepEqual(tarea, {
    id: 1,
    titulo: "Leer norma",
    descripcion: "",
    prioridad: "media",
    estado: "pendiente",
  });
  assert.deepEqual(JSON.parse(leerArchivo()), { ultimoId: 1, tareas: [tarea] });
});

test("CP-02 listar todas y filtrar por estado", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "A" });
  gestor.crear({ titulo: "B" });
  gestor.crear({ titulo: "C" });
  gestor.cambiarEstado(2, "en_progreso");
  assert.equal(gestor.listar().length, 3);
  const enProgreso = gestor.listar({ estado: "en_progreso" });
  assert.deepEqual(enProgreso.map((t) => t.id), [2]);
});

test("CP-03 obtener una tarea por id", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "Primera" });
  gestor.crear({ titulo: "Segunda", descripcion: "detalle", prioridad: "alta" });
  assert.deepEqual(gestor.obtener(2), {
    id: 2,
    titulo: "Segunda",
    descripcion: "detalle",
    prioridad: "alta",
    estado: "pendiente",
  });
});

test("CP-04 cambiar el estado y guardarlo", () => {
  const { gestor, leerArchivo } = nuevoEntorno();
  gestor.crear({ titulo: "Informe" });
  gestor.cambiarEstado(1, "en_progreso");
  assert.equal(JSON.parse(leerArchivo()).tareas[0].estado, "en_progreso");
  gestor.cambiarEstado(1, "completada");
  assert.equal(JSON.parse(leerArchivo()).tareas[0].estado, "completada");
});

test("CP-05 eliminar una tarea", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "Borrar" });
  gestor.crear({ titulo: "Quedar" });
  const eliminada = gestor.eliminar(1);
  assert.equal(eliminada.titulo, "Borrar");
  assert.deepEqual(gestor.listar().map((t) => t.id), [2]);
});

test("CP-06 las tareas persisten entre ejecuciones", () => {
  const { gestor, crearGestor } = nuevoEntorno();
  const creada = gestor.crear({ titulo: "Persistir", prioridad: "baja" });
  const otroGestor = crearGestor();
  assert.deepEqual(otroGestor.obtener(1), creada);
});

// ---------- Negativos y límite ----------

test("CN-01 título vacío, en blanco, ausente o no textual", () => {
  const { gestor, leerArchivo } = nuevoEntorno();
  gestor.crear({ titulo: "Existente" });
  const antes = leerArchivo();
  for (const titulo of ["", "   ", undefined, 123]) {
    assert.throws(() => gestor.crear({ titulo }), ErrorValidacion, `título ${titulo}`);
  }
  assert.throws(() => gestor.crear(), ErrorValidacion);
  assert.equal(leerArchivo(), antes);
});

test("CN-02 valores límite de título (100) y descripción (500)", () => {
  const { gestor } = nuevoEntorno();
  assert.equal(gestor.crear({ titulo: "a".repeat(100) }).titulo.length, 100);
  assert.throws(() => gestor.crear({ titulo: "a".repeat(101) }), ErrorValidacion);
  assert.equal(gestor.crear({ titulo: "x", descripcion: "d".repeat(500) }).descripcion.length, 500);
  assert.throws(() => gestor.crear({ titulo: "x", descripcion: "d".repeat(501) }), ErrorValidacion);
  assert.equal(gestor.listar().length, 2);
});

test("CN-03 prioridad y estado inválidos", () => {
  const { gestor, leerArchivo } = nuevoEntorno();
  gestor.crear({ titulo: "Tarea" });
  const antes = leerArchivo();
  assert.throws(() => gestor.crear({ titulo: "x", prioridad: "urgente" }), {
    name: "ErrorValidacion",
    message: /baja, media, alta/,
  });
  assert.throws(() => gestor.cambiarEstado(1, "hecha"), {
    name: "ErrorValidacion",
    message: /pendiente, en_progreso, completada/,
  });
  assert.throws(() => gestor.listar({ estado: "hecha" }), ErrorValidacion);
  assert.equal(leerArchivo(), antes);
});

test("CN-04 id inexistente", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "Única" });
  const esperado = { name: "ErrorNoEncontrado", message: /id 99/ };
  assert.throws(() => gestor.obtener(99), esperado);
  assert.throws(() => gestor.cambiarEstado(99, "completada"), esperado);
  assert.throws(() => gestor.eliminar(99), esperado);
  assert.ok(new ErrorNoEncontrado(1) instanceof Error);
});

test("CN-05 una tarea completada no cambia de estado", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "Cerrar" });
  gestor.cambiarEstado(1, "completada");
  assert.throws(() => gestor.cambiarEstado(1, "pendiente"), ErrorEstado);
  assert.equal(gestor.obtener(1).estado, "completada");
});

test("CN-06 ids inválidos", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "Tarea" });
  for (const id of [0, -1, 1.5, NaN, "1"]) {
    assert.throws(() => gestor.obtener(id), ErrorValidacion, `id ${id}`);
  }
});

test("CN-07 no se reutiliza un id ya usado", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "A" });
  gestor.crear({ titulo: "B" });
  gestor.crear({ titulo: "C" });
  gestor.eliminar(3);
  const nueva = gestor.crear({ titulo: "D" });
  assert.equal(nueva.id, 4);
});

// Regresión de DEF-01: un archivo de la versión 1 (solo la lista) se sigue leyendo.
test("CN-07b archivo del formato anterior continúa la numeración", () => {
  const tarea = { id: 5, titulo: "Vieja", descripcion: "", prioridad: "baja", estado: "pendiente" };
  const { gestor, avisos } = nuevoEntorno(JSON.stringify([tarea]));
  assert.deepEqual(gestor.listar(), [tarea]);
  assert.equal(gestor.crear({ titulo: "Nueva" }).id, 6);
  assert.equal(avisos.length, 0);
});
