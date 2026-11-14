# Casos de prueba

Diseñados antes de ejecutar (commit b0ce671). Ejecución 1: código del commit 7503198. Tipo: **P** positivo, **N** negativo o límite, **R** recuperación. Forma: **A** automatizado (`tests/`), **M** manual.

| ID | Tipo | Forma | Requisito / riesgo | Datos y pasos | Resultado esperado | Ejecución 1 |
|---|---|---|---|---|---|---|
| CP-01 | P | A | RF-01 | Crear `{ titulo: "  Leer norma  " }` | Tarea id 1, título `Leer norma` (sin espacios), descripción vacía, prioridad `media`, estado `pendiente`; queda en el archivo | Aprobado |
| CP-02 | P | A | RF-02 | Crear 3 tareas, pasar una a `en_progreso`; listar sin filtro y con `estado: "en_progreso"` | 3 tareas sin filtro; 1 con filtro | Aprobado |
| CP-03 | P | A | RF-02 | Crear 2 tareas y obtener la id 2 | Devuelve la segunda tarea completa | Aprobado |
| CP-04 | P | A | RF-03 | Cambiar una tarea a `en_progreso` y luego a `completada` | Cada cambio se guarda en el archivo | Aprobado |
| CP-05 | P | A | RF-04 | Crear 2 tareas y eliminar la id 1 | Devuelve la eliminada; queda solo la id 2 | Aprobado |
| CP-06 | P | A | RNF-01 | Crear una tarea y leerla con un gestor nuevo sobre el mismo archivo | La tarea sigue ahí con los mismos datos | Aprobado |
| CN-01 | N | A | RF-05, R-02 | Crear con título `""`, `"   "`, sin título y con un número | `ErrorValidacion`; el archivo no cambia | Aprobado |
| CN-02 | N | A | RF-01, R-02 | Título de 100 caracteres y de 101; descripción de 500 y de 501 | 100 y 500 se aceptan; 101 y 501 dan `ErrorValidacion` | Aprobado |
| CN-03 | N | A | RF-05, R-02 | Prioridad `urgente`; cambiar a estado `hecha`; filtrar por estado `hecha` | `ErrorValidacion` que nombra los valores permitidos; nada cambia | Aprobado |
| CN-04 | N | A | RF-02 a RF-04, R-04 | Obtener, cambiar estado y eliminar la id 99, que no existe | `ErrorNoEncontrado` con el id en el mensaje | Aprobado |
| CN-05 | N | A | RF-03 | Completar una tarea e intentar pasarla a `pendiente` | `ErrorEstado`; sigue `completada` | Aprobado |
| CN-06 | N | A | RF-05, R-04 | Obtener con id `0`, `-1`, `1.5` y `NaN` (lo que llega de la CLI con `ver abc`) | `ErrorValidacion` | Aprobado |
| CN-07 | N | A | RF-01, R-03 | Crear 3 tareas, eliminar la id 3 y crear otra | La nueva tarea **no reutiliza** un id ya usado (recibe la id 4), para que un comando viejo como `eliminar 3` no borre otra tarea | Falla (DEF-01) |
| CR-01 | R | A | RNF-01, R-01 | Escribir texto que no es JSON en el archivo y luego listar y crear | No se cae; avisa; deja el archivo original como `.corrupto-*`; se puede crear una tarea nueva | Aprobado |
| CR-02 | R | A | RNF-01, R-01 | Archivo con JSON válido que no es una lista (`{"a":1}`) | Igual que CR-01 | Aprobado |
| CR-03 | R | A | RNF-01, R-01, R-03 | Archivo con una lista de elementos mal formados (`[{"titulo":"x"}, 5]`) | Se trata como dañado: respaldo, aviso y lista nueva; nunca se crean tareas con id inválido | Falla (DEF-02) |
| CM-01 | P | M | RF-01 a RF-05, R-04 | Flujo completo por la CLI: crear, listar, estado, ver, eliminar, más un error | Mensajes claros; en error, texto `Error: …` y código de salida 1 | Falla (DEF-03) |
| CM-02 | P | M | R-05 | Medición exploratoria: crear y listar con 1000 tareas en el archivo | Registro del tiempo (sin umbral; solo referencia) | Ejecutado (referencia) |

**Resumen:** 18 casos: 8 positivos, 7 negativos o de límite, 3 de recuperación; 16 automatizados y 2 manuales.
