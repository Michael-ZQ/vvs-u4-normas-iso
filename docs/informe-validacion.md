# Informe de validación y dictamen

## Criterios de aceptación

| ID | Umbral | Ejecución 1 | Final |
|---|---|---|---|
| CA-01 | 4 de 4 operaciones básicas | ✔ 4 / 4 | ✔ 4 / 4 |
| CA-02 | ≥ 80 % de casos aprobados | ✔ 83,3 % | ✔ 100 % |
| CA-03 | 100 % de ejecución | ✔ 100 % | ✔ 100 % |
| CA-04 | 0 defectos críticos o altos abiertos | ✘ DEF-02 (alta) | ✔ 0 |
| CA-05 | Recuperación ante archivo dañado | ✘ CR-03 falla | ✔ CR-01 a CR-03b |
| CA-06 | Cobertura de líneas ≥ 80 % | ✔ 99,02 % (sin `cli.js`) | ✔ 96,11 % |

Con la regla de decisión fijada antes de probar, la ejecución 1 daba **«requiere correcciones»** porque fallaban CA-04 y CA-05.

## Dictamen

**Aceptable.**

La versión final (commit `499e869`) cumple los seis criterios y no tiene defectos abiertos. Lo sustentan:

- `evidencias/ejecucion-5-final.txt`: 20 de 20 pruebas automatizadas aprobadas.
- `evidencias/cm-01-cli-final.txt`: flujo manual de la CLI con mensajes claros.
- `evidencias/cobertura-2-final.txt`: cobertura de líneas de 96,11 %.
- `docs/defectos.md`: los tres defectos están cerrados y tienen prueba de regresión.

El dictamen vale para el alcance probado: uso personal, un solo proceso y archivo local. No vale para varios usuarios ni para acceso simultáneo.

## Riesgos residuales

| ID | Riesgo | Impacto | Probabilidad | Por qué queda |
|---|---|---|---|---|
| RR-1 | Si el programa se corta mientras escribe, el JSON puede quedar a medias. La recuperación lo respalda, pero la lista activa empieza vacía | Alto | Baja | La escritura no es atómica y este caso quedó fuera del alcance |
| RR-2 | Si una sola tarea del archivo está mal, se aparta el archivo entero; las tareas buenas quedan solo en el respaldo | Medio | Baja | La recuperación es de todo o nada |
| RR-3 | Dos procesos a la vez pueden pisarse los cambios | Medio | Baja | No hay bloqueo del archivo; acceso concurrente fuera de alcance |
| RR-4 | Sesgo de quien prueba: la misma persona diseñó, ejecutó y evaluó | Medio | Media | Actividad individual |
| RR-5 | `crear()` reescribe todo el archivo: ≈ 12,6 ms con 1000 tareas y crece con el tamaño | Bajo | Baja | Diseño simple con JSON |

## Mejoras priorizadas

| Prioridad | Mejora | Riesgo que reduce | Cómo se verificaría |
|---|---|---|---|
| 1 | Escritura atómica: guardar en un archivo temporal y renombrarlo, y mantener una copia `.bak` de la última versión buena | RR-1, R-01 | Prueba que simula un archivo temporal a medias y comprueba que se conserva la versión anterior |
| 2 | Recuperación parcial: conservar las tareas válidas y apartar solo las dañadas, con un aviso de cuáles fueron | RR-2 | Ampliar CR-03 con un archivo que mezcle tareas válidas e inválidas |
| 3 | Integración continua con `npm run coverage` en cada push y revisión de los casos por otra persona | RR-4, cobertura de `cli.js` | Ejecución en GitHub Actions y comentarios de revisión en el pull request |
