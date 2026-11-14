// CM-02: medición exploratoria. Crea 1000 tareas y mide crear y listar con el archivo lleno.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { AlmacenJSON } = require("../src/almacen");
const { GestorTareas } = require("../src/gestor");

const N = 1000;
const REPETICIONES = 50;
const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), "vvs-u4-rend-"));
const ruta = path.join(carpeta, "tareas.json");
const gestor = new GestorTareas(new AlmacenJSON(ruta));

const ms = (inicio) => Number(process.hrtime.bigint() - inicio) / 1e6;

let inicio = process.hrtime.bigint();
for (let i = 1; i <= N; i++) gestor.crear({ titulo: `Tarea ${i}` });
const cargaTotal = ms(inicio);

const medir = (fn) => {
  const tiempos = [];
  for (let i = 0; i < REPETICIONES; i++) {
    const t = process.hrtime.bigint();
    fn();
    tiempos.push(ms(t));
  }
  tiempos.sort((a, b) => a - b);
  return { mediana: tiempos[Math.floor(REPETICIONES / 2)], max: tiempos[REPETICIONES - 1] };
};

const listar = medir(() => gestor.listar());
const crear = medir(() => gestor.crear({ titulo: "Extra" }));
const kb = (fs.statSync(ruta).size / 1024).toFixed(1);

const texto = [
  "Evidencia: CM-02 rendimiento exploratorio",
  `Fecha: ${new Date().toISOString()}`,
  `Node: ${process.version} · ${process.platform} · ${os.cpus()[0].model}`,
  "",
  `Crear ${N} tareas una por una: ${cargaTotal.toFixed(0)} ms en total (${(cargaTotal / N).toFixed(2)} ms por tarea)`,
  `Tamaño del archivo con ${N} tareas: ${kb} KB`,
  `listar() con ${N} tareas, ${REPETICIONES} repeticiones: mediana ${listar.mediana.toFixed(2)} ms, máximo ${listar.max.toFixed(2)} ms`,
  `crear() con ${N}+ tareas, ${REPETICIONES} repeticiones: mediana ${crear.mediana.toFixed(2)} ms, máximo ${crear.max.toFixed(2)} ms`,
  "",
  "Limitación: una sola máquina, disco local y sin otras cargas controladas. Sirve como referencia, no como prueba de rendimiento formal.",
  "",
].join("\n");
fs.writeFileSync(path.join(__dirname, "..", "evidencias", "cm-02-rendimiento.txt"), texto);
console.log(texto);
