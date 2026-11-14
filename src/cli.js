#!/usr/bin/env node
const path = require("node:path");
const { AlmacenJSON } = require("./almacen");
const { GestorTareas } = require("./gestor");

const AYUDA = `Uso: node src/cli.js <comando> [argumentos]

  crear "<título>" [--descripcion "<texto>"] [--prioridad baja|media|alta]
  listar [--estado pendiente|en_progreso|completada]
  ver <id>
  estado <id> <pendiente|en_progreso|completada>
  eliminar <id>

Las tareas se guardan en data/tareas.json (o en la ruta de TAREAS_ARCHIVO).`;

function leerOpciones(args) {
  const opciones = {};
  const resto = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      opciones[args[i].slice(2)] = args[i + 1];
      i++;
    } else {
      resto.push(args[i]);
    }
  }
  return { opciones, resto };
}

function mostrar(tarea) {
  return `#${tarea.id} [${tarea.estado}] (${tarea.prioridad}) ${tarea.titulo}`;
}

function ejecutar(argv, { gestor, salida = console.log }) {
  const [comando, ...args] = argv;
  const { opciones, resto } = leerOpciones(args);
  switch (comando) {
    case "crear": {
      const tarea = gestor.crear({
        titulo: resto[0],
        descripcion: opciones.descripcion,
        prioridad: opciones.prioridad,
      });
      salida(`Creada ${mostrar(tarea)}`);
      break;
    }
    case "listar": {
      const tareas = gestor.listar({ estado: opciones.estado });
      salida(tareas.length ? tareas.map(mostrar).join("\n") : "No hay tareas");
      break;
    }
    case "ver":
      salida(mostrar(gestor.obtener(Number(resto[0]))));
      break;
    case "estado":
      salida(`Actualizada ${mostrar(gestor.cambiarEstado(Number(resto[0]), resto[1]))}`);
      break;
    case "eliminar":
      salida(`Eliminada ${mostrar(gestor.eliminar(Number(resto[0])))}`);
      break;
    default:
      salida(AYUDA);
  }
}

if (require.main === module) {
  const ruta = process.env.TAREAS_ARCHIVO || path.join(__dirname, "..", "data", "tareas.json");
  const gestor = new GestorTareas(new AlmacenJSON(ruta));
  try {
    ejecutar(process.argv.slice(2), { gestor });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { ejecutar };
