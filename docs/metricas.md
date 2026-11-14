# Métricas

Ambiente: Windows 11, Node.js 22.23.3. Ejecución 1 con el commit `7503198`; ejecución final con `499e869`.

## Indicadores del proceso de prueba

| Métrica | Fórmula | Ejecución 1 | Final |
|---|---|---|---|
| Tasa de ejecución | casos ejecutados / planificados | 18 / 18 = **100 %** | 18 / 18 = **100 %** |
| Casos aprobados | casos aprobados / ejecutados | 15 / 18 = **83,3 %** | 18 / 18 = **100 %** |
| Pruebas automatizadas aprobadas | aprobadas / ejecutadas | 14 / 16 = 87,5 % | 20 / 20 = 100 % |
| Operaciones básicas con caso positivo aprobado | operaciones / 4 | 4 / 4 | 4 / 4 |
| Defectos abiertos · crítica | — | 0 | 0 |
| Defectos abiertos · alta | — | 1 (DEF-02) | 0 |
| Defectos abiertos · media | — | 1 (DEF-01) | 0 |
| Defectos abiertos · baja | — | 1 (DEF-03) | 0 |

CM-02 (rendimiento) cuenta como aprobado porque su resultado esperado era solo registrar los tiempos.

## Métrica técnica: cobertura de código

Comando: `npm run coverage` (`node --test --experimental-test-coverage`). El mismo comando falla si la cobertura de líneas baja del 80 % (CA-06).

| Momento | Líneas | Ramas | Funciones | Archivos medidos | Evidencia |
|---|---|---|---|---|---|
| Ejecución 1 | 99,02 % | 98,44 % | 100 % | 4 (sin `cli.js`) | `evidencias/cobertura-1-inicial.txt` |
| Final | **96,11 %** | **97,22 %** | **100 %** | 5 | `evidencias/cobertura-2-final.txt` |

**Interpretación:** la cobertura bajó, pero el número final es más fiel. Node solo mide los archivos que las pruebas cargan. En la ejecución 1 ninguna prueba automatizada usaba `cli.js`, así que ese archivo no aparecía y el 99 % parecía mejor de lo que era. Al automatizar CM-01a, `cli.js` entró a la medición.

Líneas sin cubrir en la versión final:

- `cli.js` 76-84: el bloque que arranca el programa desde la terminal. Se probó solo de forma manual (CM-01).
- `almacen.js` 58-59: un `ultimoId` menor que el mayor id del archivo.
- `validacion.js` 25-26: una descripción que no es texto.

## Otros datos

| Dato | Valor | Evidencia |
|---|---|---|
| Tiempo de la suite automatizada | ≈ 0,14 s | `evidencias/ejecucion-5-final.txt` |
| `listar()` con 1000 tareas (mediana de 50) | 0,60 ms | `evidencias/cm-02-rendimiento.txt` |
| `crear()` con 1000 tareas (mediana de 50) | 12,58 ms | `evidencias/cm-02-rendimiento.txt` |
| Defectos encontrados por los casos diseñados | 3 en 18 casos | `docs/defectos.md` |

## Limitaciones

- Cobertura alta no significa ausencia de defectos: con el 99 % de líneas cubiertas seguían abiertos DEF-01 y DEF-02.
- El porcentaje de casos aprobados depende de cuántos casos y cuáles se diseñen; 100 % de 18 casos no dice nada de lo que no se probó (escritura interrumpida, dos procesos a la vez).
- El rendimiento se midió en una sola máquina, sin repetir en otro equipo; sirve como referencia.
- Una sola persona diseñó, ejecutó y evaluó las pruebas.
