# Matriz de calidad y trazabilidad (ISO/IEC 25010)

Atributos elegidos y por qué:

- **Adecuación funcional** (completitud y corrección): el gestor solo sirve si las cuatro operaciones existen y dan el resultado correcto.
- **Fiabilidad** (tolerancia a fallos y recuperabilidad): el mayor riesgo es perder las tareas guardadas (R-01).
- **Mantenibilidad** (modularidad y capacidad de prueba): el producto se seguirá modificando, así que tiene que poder probarse de forma automática.

Se dejan fuera eficiencia de desempeño (se mide solo de forma exploratoria, R-05), seguridad (no hay usuarios ni red) y usabilidad (interfaz mínima de consola).

| ID | Necesidad | Atributo (subcaracterística) | Requisito | Métrica / criterio | Método de prueba | Evidencia | Decisión |
|---|---|---|---|---|---|---|---|
| M-01 | Registrar y gestionar mis tareas | Adecuación funcional (completitud) | RF-01 a RF-04 | 4 de 4 operaciones con caso positivo aprobado (CA-01) | Pruebas automatizadas `node:test` | CP-01 a CP-05 aprobados en las dos ejecuciones (`ejecucion-5-final.txt`) | **Cumple** |
| M-02 | Que lo guardado sea correcto | Adecuación funcional (corrección) | RF-01, RF-03, RF-05 | 100 % de entradas inválidas rechazadas con error claro y sin cambiar el archivo; ≥ 80 % de casos aprobados (CA-02) | Casos negativos y de valores límite | CN-01 a CN-06 aprobados; 18 de 18 casos aprobados al final; DEF-03 cerrado (`cm-01-cli-final.txt`) | **Cumple** |
| M-03 | No perder tareas si el archivo se daña | Fiabilidad (recuperabilidad) | RNF-01 | La app sigue, crea respaldo y conserva el archivo dañado (CA-05) | Caso de recuperación con JSON corrupto | CR-01 y CR-02 aprobados; CR-03 falló (DEF-02) y pasa tras la corrección junto con CR-03b | **Cumple**, con riesgo residual RR-1 y RR-2 |
| M-04 | No confundir una tarea con otra | Fiabilidad (tolerancia a fallos) | RF-01, RF-04 | 0 ids repetidos o reutilizados tras crear, eliminar y volver a crear | Prueba de secuencia | CN-07 falló (DEF-01) y pasa tras la corrección; regresión CN-07b | **Cumple** |
| M-05 | Cambiar el código sin romperlo | Mantenibilidad (capacidad de prueba) | RNF-02 | Cobertura de líneas ≥ 80 % (CA-06); módulos separados | `node --test --experimental-test-coverage` | Cobertura de líneas 96,11 %, ramas 97,22 % (`cobertura-2-final.txt`); cinco módulos | **Cumple** |
| M-06 | Saber si se puede entregar | Todos | Todos | 100 % de ejecución (CA-03); 0 defectos críticos o altos (CA-04) | Registro de ejecución y de defectos | 18 de 18 casos ejecutados; 0 defectos abiertos (`defectos.md`) | **Cumple** |

Las columnas **Evidencia** y **Decisión** se completaron después de la ejecución final. Las evidencias están en `evidencias/`. Detalle en [`metricas.md`](metricas.md) e [`informe-validacion.md`](informe-validacion.md).
