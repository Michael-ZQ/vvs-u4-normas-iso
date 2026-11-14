// Ejecuta un flujo de comandos de la CLI y guarda la transcripción como evidencia.
// Uso: node scripts/flujo-cli.js <cm-01|def-02> [nombre-archivo]
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const FLUJOS = {
  // CM-01: flujo completo por la CLI, incluido un error.
  "cm-01": {
    inicial: undefined,
    comandos: [
      ["crear", "Estudiar ISO 25010", "--prioridad", "alta"],
      ["crear", "Preparar informe", "--descripcion", "Seis apartados"],
      ["listar"],
      ["estado", "1", "en_progreso"],
      ["listar", "--estado", "en_progreso"],
      ["ver", "2"],
      ["eliminar", "2"],
      ["ver", "2"],
      ["crear", "   "],
      ["ver", "abc"],
      ["estado", "1", "hecha"],
      ["ayuda"],
    ],
  },
  // DEF-02: archivo con una lista de elementos mal formados.
  "def-02": {
    inicial: '[{"titulo":"x"}, 5]',
    comandos: [["crear", "Nueva"], ["listar"], ["eliminar", "1"]],
  },
};

const flujo = FLUJOS[process.argv[2]];
if (!flujo) {
  console.error(`Flujo desconocido. Use: ${Object.keys(FLUJOS).join(", ")}`);
  process.exit(1);
}
const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), "vvs-u4-cli-"));
const archivo = path.join(carpeta, "tareas.json");
if (flujo.inicial !== undefined) fs.writeFileSync(archivo, flujo.inicial);

const lineas = [`Evidencia: ${process.argv[2]}`, `Fecha: ${new Date().toISOString()}`, `Node: ${process.version}`, ""];
if (flujo.inicial !== undefined) lineas.push(`Contenido inicial de tareas.json: ${flujo.inicial}`, "");
for (const comando of flujo.comandos) {
  const r = spawnSync(process.execPath, [path.join(__dirname, "..", "src", "cli.js"), ...comando], {
    encoding: "utf8",
    env: { ...process.env, TAREAS_ARCHIVO: archivo },
  });
  lineas.push(`$ node src/cli.js ${comando.map((c) => (c.includes(" ") || c.trim() === "" ? `"${c}"` : c)).join(" ")}`);
  lineas.push((r.stdout + r.stderr).trimEnd().split(carpeta).join("<tmp>"));
  lineas.push(`[código de salida: ${r.status}]`, "");
}
lineas.push("Contenido final de tareas.json:", fs.readFileSync(archivo, "utf8"));
const texto = lineas.join("\n") + "\n";
const destino = path.join(__dirname, "..", "evidencias", `${process.argv[3] || process.argv[2]}.txt`);
fs.writeFileSync(destino, texto);
console.log(texto);
