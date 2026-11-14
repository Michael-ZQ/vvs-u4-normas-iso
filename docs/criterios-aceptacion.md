# Criterios de aceptación

Se fijan **antes de implementar y de probar**. Los umbrales son didácticos, tomados de la guía de la Unidad 4, no exigencias de la norma.

| ID | Criterio | Umbral | Atributo ISO/IEC 25010 |
|---|---|---|---|
| CA-01 | Operaciones básicas (crear, consultar, actualizar estado, eliminar) cubiertas por al menos un caso positivo aprobado | 100 % (4 de 4) | Adecuación funcional · completitud |
| CA-02 | Casos aprobados en la ejecución final | ≥ 80 % | Adecuación funcional · corrección |
| CA-03 | Tasa de ejecución (casos ejecutados / planificados) | 100 % | — (proceso de prueba) |
| CA-04 | Defectos abiertos de severidad crítica o alta | 0 | Todos |
| CA-05 | Con el archivo JSON dañado la aplicación no se cae, guarda un respaldo y sigue funcionando | Se cumple | Fiabilidad · recuperabilidad |
| CA-06 | Cobertura de líneas del código fuente (métrica técnica) | ≥ 80 % | Mantenibilidad · capacidad de prueba |

## Severidad de defectos

| Severidad | Significado |
|---|---|
| Crítica | Pérdida de datos o caída de la aplicación |
| Alta | Una operación básica da un resultado incorrecto |
| Media | Validación o mensaje incorrecto, con forma de seguir trabajando |
| Baja | Detalle de presentación o de documentación |

## Regla de decisión

| Dictamen | Condición |
|---|---|
| **Aceptable** | Se cumplen CA-01 a CA-06 y no hay defectos medios abiertos |
| **Aceptable con condiciones** | Se cumplen CA-01, CA-04 y CA-05, pero falla CA-02, CA-03 o CA-06, o quedan defectos medios o bajos abiertos con un plan para cerrarlos |
| **Requiere correcciones** | Falla CA-01, CA-04 o CA-05 |
