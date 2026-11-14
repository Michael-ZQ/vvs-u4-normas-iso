const { test } = require("node:test");
const assert = require("node:assert/strict");
const { nuevoEntorno } = require("./ayuda");
const { ejecutar } = require("../src/cli");

function cli(gestor, ...argv) {
  const salida = [];
  ejecutar(argv, { gestor, salida: (m) => salida.push(m) });
  return salida.join("\n");
}

// Parte automatizada de CM-01: el flujo básico por la CLI.
test("CM-01a flujo básico por la CLI", () => {
  const { gestor } = nuevoEntorno();
  assert.equal(cli(gestor, "crear", "Leer norma", "--prioridad", "alta"), "Creada #1 [pendiente] (alta) Leer norma");
  assert.equal(cli(gestor, "estado", "1", "en_progreso"), "Actualizada #1 [en_progreso] (alta) Leer norma");
  assert.equal(cli(gestor, "listar", "--estado", "en_progreso"), "#1 [en_progreso] (alta) Leer norma");
  assert.equal(cli(gestor, "ver", "1"), "#1 [en_progreso] (alta) Leer norma");
  assert.equal(cli(gestor, "eliminar", "1"), "Eliminada #1 [en_progreso] (alta) Leer norma");
  assert.equal(cli(gestor, "listar"), "No hay tareas");
  assert.match(cli(gestor), /^Uso:/);
});

// Regresión de DEF-03: el mensaje muestra lo que escribió el usuario.
test("CM-01b id no numérico en la CLI muestra lo escrito", () => {
  const { gestor } = nuevoEntorno();
  gestor.crear({ titulo: "Tarea" });
  assert.throws(() => cli(gestor, "ver", "abc"), { name: "ErrorValidacion", message: /Id inválido: abc\./ });
  assert.throws(() => cli(gestor, "eliminar"), { name: "ErrorValidacion", message: /\(vacío\)/ });
  assert.throws(() => cli(gestor, "estado", "1.5", "completada"), { message: /Id inválido: 1\.5\./ });
});
