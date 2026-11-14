# Matriz de calidad y trazabilidad (ISO/IEC 25010)

Atributos elegidos y por qué:

- **Adecuación funcional** (completitud y corrección): el gestor solo sirve si las cuatro operaciones existen y dan el resultado correcto.
- **Fiabilidad** (tolerancia a fallos y recuperabilidad): el mayor riesgo es perder las tareas guardadas (R-01).
- **Mantenibilidad** (modularidad y capacidad de prueba): el producto se seguirá modificando, así que tiene que poder probarse de forma automática.

Se dejan fuera eficiencia de desempeño (se mide solo de forma exploratoria, R-05), seguridad (no hay usuarios ni red) y usabilidad (interfaz mínima de consola).

| ID | Necesidad | Atributo (subcaracterística) | Requisito | Métrica / criterio | Método de prueba | Evidencia | Decisión |
|---|---|---|---|---|---|---|---|
| M-01 | Registrar y gestionar mis tareas | Adecuación funcional (completitud) | RF-01 a RF-04 | 4 de 4 operaciones con caso positivo aprobado (CA-01) | Pruebas automatizadas `node:test` | _pendiente_ | _pendiente_ |
| M-02 | Que lo guardado sea correcto | Adecuación funcional (corrección) | RF-01, RF-03, RF-05 | 100 % de entradas inválidas rechazadas con error claro y sin cambiar el archivo; ≥ 80 % de casos aprobados (CA-02) | Casos negativos y de valores límite | _pendiente_ | _pendiente_ |
| M-03 | No perder tareas si el archivo se daña | Fiabilidad (recuperabilidad) | RNF-01 | La app sigue, crea respaldo y conserva el archivo dañado (CA-05) | Caso de recuperación con JSON corrupto | _pendiente_ | _pendiente_ |
| M-04 | No confundir una tarea con otra | Fiabilidad (tolerancia a fallos) | RF-01, RF-04 | 0 ids duplicados tras crear, eliminar y volver a crear | Prueba de secuencia | _pendiente_ | _pendiente_ |
| M-05 | Cambiar el código sin romperlo | Mantenibilidad (capacidad de prueba) | RNF-02 | Cobertura de líneas ≥ 80 % (CA-06); módulos separados | `node --test --experimental-test-coverage` | _pendiente_ | _pendiente_ |
| M-06 | Saber si se puede entregar | Todos | Todos | 100 % de ejecución (CA-03); 0 defectos críticos o altos (CA-04) | Registro de ejecución y de defectos | _pendiente_ | _pendiente_ |

Las columnas **Evidencia** y **Decisión** se completan después de ejecutar las pruebas.
