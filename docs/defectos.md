# Registro de defectos

Severidades según [`criterios-aceptacion.md`](criterios-aceptacion.md).

| ID | Caso | Severidad | Estado | Corrección | Reejecución |
|---|---|---|---|---|---|
| DEF-01 | CN-07 | Media | Cerrado | `83c5ffc` | `evidencias/ejecucion-3-def01.txt` |
| DEF-02 | CR-03 | Alta | Cerrado | `b60f4be` | `evidencias/ejecucion-2-def02.txt` |
| DEF-03 | CM-01 | Baja | Cerrado | `499e869` | `evidencias/ejecucion-5-final.txt`, `evidencias/cm-01-cli-final.txt` |

Se corrigieron por severidad: primero DEF-02 (alta), luego DEF-01 (media) y al final DEF-03 (baja). Después de cada corrección se volvió a ejecutar la suite completa.

## DEF-01 · Se reutiliza el id de una tarea eliminada

- **Caso:** CN-07 · **Requisito / riesgo:** RF-01, R-03
- **Pasos:** crear tres tareas, eliminar la id 3 y crear otra.
- **Esperado:** la nueva tarea recibe la id 4.
- **Real:** recibe la id 3. El id se calcula como el mayor existente + 1, así que al borrar la última se vuelve a usar.
- **Impacto:** un comando guardado o recordado (`eliminar 3`) actuaría sobre una tarea distinta.
- **Severidad:** Media. Crear funciona y los ids siguen siendo únicos entre las tareas que existen, pero se pierde la identidad histórica.
- **Evidencia:** `evidencias/ejecucion-1-inicial.txt` (`3 !== 4`).
- **Corrección:** el archivo guarda `{ ultimoId, tareas }`; el formato anterior se sigue leyendo. Regresión: CN-07b.

## DEF-02 · Una lista con elementos mal formados se acepta como válida

- **Caso:** CR-03 · **Requisito / riesgo:** RNF-01, R-01, R-03
- **Pasos:** dejar en `tareas.json` el texto `[{"titulo":"x"}, 5]` y ejecutar `crear "Nueva"`, `listar` y `eliminar 1`.
- **Esperado:** el archivo se trata como dañado: respaldo, aviso y lista nueva.
- **Real:** solo se revisa que sea una lista. Se muestran tareas `#undefined`, la nueva tarea recibe id `NaN` y se guarda como `"id": null`, así que ya no se puede ver ni eliminar.
- **Impacto:** crear, una operación básica, da un resultado incorrecto y deja una tarea inaccesible.
- **Severidad:** Alta.
- **Evidencia:** `evidencias/ejecucion-1-inicial.txt` y `evidencias/def-02-reproduccion.txt`.
- **Corrección:** el almacén valida cada tarea y que no se repitan ids; si algo falla, aplica la recuperación de RNF-01. Regresión: CR-03b.

## DEF-03 · Mensaje de id inválido muestra `NaN`

- **Caso:** CM-01 · **Requisito / riesgo:** RF-05, R-04
- **Pasos:** `node src/cli.js ver abc`.
- **Esperado:** un mensaje que muestre lo que escribió el usuario.
- **Real:** `Error: Id inválido: NaN. Debe ser un entero positivo`. La CLI convierte el texto con `Number()` antes de validar, y el usuario no escribió `NaN`.
- **Impacto:** el mensaje confunde, pero se rechaza la entrada y no se daña nada.
- **Severidad:** Baja.
- **Evidencia:** `evidencias/cm-01-cli-inicial.txt`.
- **Corrección:** la CLI valida el texto con `leerId()` antes de convertirlo. Regresión: CM-01a y CM-01b.

## Observación: regresión durante la corrección de DEF-03

El primer intento de corregir DEF-03 tenía la expresión regular mal escrita (`/^d+$/` en lugar de `/^\d+$/`) y rechazaba también ids válidos como `1`. La prueba nueva CM-01a falló (19 de 20) antes de hacer el commit, así que el código con el error nunca entró al historial. Evidencia: `evidencias/ejecucion-4-regresion-def03.txt`. No se registra como defecto del producto porque no llegó a una versión entregada, pero muestra para qué sirve volver a ejecutar todo después de corregir.
