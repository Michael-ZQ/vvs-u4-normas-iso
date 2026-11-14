# Plan de pruebas

Estructura basada en el plan de pruebas de ISO/IEC/IEEE 29119-3.

## 1. Objetivo

Comprobar, con evidencias reproducibles, si el gestor de tareas cumple los criterios de aceptación CA-01 a CA-06 ([`criterios-aceptacion.md`](criterios-aceptacion.md)) y si puede entregarse.

## 2. Alcance

| Dentro | Fuera |
|---|---|
| RF-01 a RF-05, RNF-01 y RNF-02 | Acceso concurrente al mismo archivo |
| Módulos `gestor`, `validacion`, `almacen` y `cli` | Interrupción real de una escritura a mitad (corte de energía) |
| Archivo JSON ausente, válido y dañado | Rendimiento formal (solo medición exploratoria) |

Niveles: pruebas de componente (gestor, almacén) y de sistema por la CLI.
Técnicas: partición de equivalencia, valores límite, adivinación de errores basada en los riesgos R-01 a R-05 y una prueba de recuperación.

## 3. Ambiente

| Elemento | Valor |
|---|---|
| Sistema | Windows 11, Git Bash |
| Entorno | Node.js 22.23.3, npm 10.9.9 |
| Herramienta | `node:test` y `node:assert` (incluidos en Node, sin dependencias) |
| Cobertura | `node --test --experimental-test-coverage` |
| Datos | Cada prueba usa un archivo JSON en una carpeta temporal propia, así no depende de otras pruebas ni de `data/` |

## 4. Riesgos del proyecto de prueba

| Riesgo | Mitigación |
|---|---|
| Pruebas que dependen unas de otras por compartir el archivo | Carpeta temporal nueva por prueba |
| Diseñar los resultados esperados mirando el código | Casos y resultados esperados escritos y versionados antes de ejecutar |
| Una sola persona diseña, ejecuta y evalúa | Criterios fijados por adelantado y evidencias guardadas en `evidencias/` |

## 5. Responsables

Actividad individual: Michael Zaquinaula asume los roles de diseñador de pruebas, ejecutor y analista de resultados. Para separar los roles, los casos se escriben y se versionan antes de ejecutar, y los resultados se registran tal como salen.

## 6. Criterios

| Tipo | Criterio |
|---|---|
| Entrada | Código en el repositorio, casos de [`casos-prueba.md`](casos-prueba.md) versionados, `npm test` ejecutable |
| Suspensión | La aplicación no arranca o falla la mayoría de los casos por un problema de ambiente |
| Reanudación | Problema de ambiente corregido; se repite la ejecución completa |
| Salida | 100 % de casos ejecutados; defectos registrados con severidad; corregidos los críticos y altos y vuelta a ejecutar la suite completa (regresión) |

## 7. Entregables

`docs/casos-prueba.md`, `tests/`, `evidencias/`, `docs/defectos.md`, `docs/informe-validacion.md`.
