# Contexto y alcance

## Producto

Gestor de tareas de línea de comandos en Node.js. Guarda las tareas en un archivo JSON local y no usa base de datos ni servidor.

## Usuarios

| Usuario | Qué necesita |
|---|---|
| Persona que organiza su trabajo (usuario final) | Registrar tareas, verlas, marcar su avance y borrar las que ya no sirven, sin perder lo guardado |
| Responsable de la entrega (docente / líder del equipo) | Saber con evidencias si el producto está listo para entregarse |
| Desarrollador que lo mantiene | Cambiar el código sin romper lo que ya funciona |

## Funciones (requisitos)

| ID | Requisito |
|---|---|
| RF-01 | Crear una tarea con título obligatorio (1 a 100 caracteres, sin contar espacios al inicio y al final), descripción opcional (máx. 500) y prioridad `baja`, `media` o `alta` (por defecto `media`). La tarea nace en estado `pendiente` con un id único |
| RF-02 | Consultar: listar todas las tareas, filtrar por estado y obtener una por id |
| RF-03 | Actualizar el estado a `pendiente`, `en_progreso` o `completada`. Una tarea `completada` ya no cambia de estado |
| RF-04 | Eliminar una tarea por id |
| RF-05 | Rechazar entradas inválidas con un error claro y sin modificar lo guardado |
| RNF-01 | Persistir en JSON. Si el archivo está dañado, la aplicación no se cae: respalda el archivo dañado, avisa y continúa |
| RNF-02 | Código en módulos separados (dominio, validación, almacenamiento, interfaz) con pruebas automatizadas |

## Riesgos del producto

| ID | Riesgo | Impacto | Probabilidad | Cómo se prueba |
|---|---|---|---|---|
| R-01 | Pérdida de tareas si el JSON se daña o una escritura se corta | Alto | Media | Caso de recuperación con archivo corrupto |
| R-02 | Se guardan datos inválidos (título vacío, estado inexistente) | Medio | Alta | Casos negativos y de límite |
| R-03 | Dos tareas con el mismo id: se modifica o borra la tarea equivocada | Alto | Media | Crear, eliminar y volver a crear |
| R-04 | Errores técnicos sin mensaje claro para el usuario | Medio | Media | Verificar tipo y mensaje de cada error |
| R-05 | Lentitud con muchas tareas | Bajo | Baja | Medición exploratoria con 1000 tareas |

## Fuera de alcance

Usuarios múltiples, acceso concurrente al mismo archivo, interfaz gráfica, fechas de vencimiento y seguridad de acceso.
