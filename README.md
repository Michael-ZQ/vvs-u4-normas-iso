# VVS · Unidad 4 — Normas internacionales

Auditoría de calidad y validación de un gestor de tareas en Node.js con ISO/IEC 25010 e ISO/IEC/IEEE 29119.

> Asignatura: Verificación y Validación de Software · Universidad Politécnica Salesiana
> Estudiante: Michael Zaquinaula · Actividad individual

## Fase A · Contexto y criterios

- [`docs/contexto.md`](docs/contexto.md): usuarios, funciones y riesgos
- [`docs/matriz-calidad.md`](docs/matriz-calidad.md): matriz necesidad → atributo → requisito → métrica → método → evidencia → decisión
- [`docs/criterios-aceptacion.md`](docs/criterios-aceptacion.md): criterios fijados antes de probar

## Fase B · Aplicación

| Módulo | Responsabilidad |
|---|---|
| `src/gestor.js` | Reglas del negocio: crear, listar, obtener, cambiar estado, eliminar |
| `src/validacion.js` | Validación de título, descripción, prioridad, estado e id |
| `src/almacen.js` | Lectura y escritura del JSON y recuperación si el archivo está dañado |
| `src/errores.js` | Errores propios con código (`VALIDACION`, `NO_ENCONTRADO`, `ESTADO`) |
| `src/cli.js` | Interfaz de línea de comandos |

Uso (Node.js 22 o superior, sin dependencias externas):

```bash
node src/cli.js crear "Estudiar ISO 25010" --prioridad alta
node src/cli.js listar --estado pendiente
node src/cli.js estado 1 en_progreso
node src/cli.js ver 1
node src/cli.js eliminar 1
```

Las tareas se guardan en `data/tareas.json`. Con la variable `TAREAS_ARCHIVO` se puede usar otra ruta.
