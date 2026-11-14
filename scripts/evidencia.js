// Ejecuta las pruebas y guarda la salida en evidencias/<nombre>.txt
// Uso: node scripts/evidencia.js <nombre> [--coverage]
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const nombre = process.argv[2] || "ejecucion";
const conCobertura = process.argv.includes("--coverage");
const args = ["--test", "--test-reporter=spec"];
if (conCobertura) {
  args.push("--experimental-test-coverage", "--test-coverage-include=src/**");
}
args.push("tests/*.test.js");

const r = spawnSync(process.execPath, args, { encoding: "utf8", cwd: path.join(__dirname, "..") });
const limpio = (r.stdout + r.stderr)
  .replace(/\x1b\[[0-9;]*m/g, "")
  .split(path.join(__dirname, "..")).join(".");
const cabecera = [
  `Evidencia: ${nombre}`,
  `Fecha: ${new Date().toISOString()}`,
  `Node: ${process.version} · ${process.platform}`,
  `Comando: node ${args.join(" ")}`,
  `Código de salida: ${r.status}`,
  "-".repeat(60),
  "",
].join("\n");
const destino = path.join(__dirname, "..", "evidencias", `${nombre}.txt`);
fs.writeFileSync(destino, cabecera + limpio);
console.log(limpio);
console.log(`Guardado en evidencias/${nombre}.txt`);
process.exitCode = r.status;
