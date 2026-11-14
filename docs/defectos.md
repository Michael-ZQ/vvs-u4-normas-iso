# Registro de defectos

Severidades según [`criterios-aceptacion.md`](criterios-aceptacion.md).

| ID | Caso | Severidad | Estado |
|---|---|---|---|
| DEF-01 | CN-07 | Media | Abierto |
| DEF-02 | CR-03 | Alta | Abierto |
| DEF-03 | CM-01 | Baja | Abierto |

## DEF-01 · Se reutiliza el id de una tarea eliminada

- **Caso:** CN-07 · **Requisito / riesgo:** RF-01, R-03
- **Pasos:** crear tres tareas, eliminar la id 3 y crear otra.
- **Esperado:** la nueva tarea recibe la id 4.
- **Real:** recibe la id 3. El id se calcula como el mayor existente + 1, así que al borrar la última se vuelve a usar.
- **Impacto:** un comando guardado o recordado (`eliminar 3`) actuaría sobre una tarea distinta.
- **Severidad:** Media. Crear funciona y los ids siguen siendo únicos entre las tareas que existen, pero se pierde la identidad histórica.
- **Evidencia:** `evidencias/ejecucion-1-inicial.txt` (`3 !== 4`).

## DEF-02 · Una lista con elementos mal formados se acepta como válida

- **Caso:** CR-03 · **Requisito / riesgo:** RNF-01, R-01, R-03
- **Pasos:** dejar en `tareas.json` el texto `[{"titulo":"x"}, 5]` y ejecutar `crear "Nueva"`, `listar` y `eliminar 1`.
- **Esperado:** el archivo se trata como dañado: respaldo, aviso y lista nueva.
- **Real:** solo se revisa que sea una lista. Se muestran tareas `#undefined`, la nueva tarea recibe id `NaN` y se guarda como `"id": null`, así que ya no se puede ver ni eliminar.
- **Impacto:** crear, una operación básica, da un resultado incorrecto y deja una tarea inaccesible.
- **Severidad:** Alta.
- **Evidencia:** `evidencias/ejecucion-1-inicial.txt` y `evidencias/def-02-reproduccion.txt`.

## DEF-03 · Mensaje de id inválido muestra `NaN`

- **Caso:** CM-01 · **Requisito / riesgo:** RF-05, R-04
- **Pasos:** `node src/cli.js ver abc`.
- **Esperado:** un mensaje que muestre lo que escribió el usuario.
- **Real:** `Error: Id inválido: NaN. Debe ser un entero positivo`. La CLI convierte el texto con `Number()` antes de validar, y el usuario no escribió `NaN`.
- **Impacto:** el mensaje confunde, pero se rechaza la entrada y no se daña nada.
- **Severidad:** Baja.
- **Evidencia:** `evidencias/cm-01-cli-inicial.txt`.
