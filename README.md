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

## Instalación y pruebas desde cero

Requisitos: Node.js 22 o superior. No hay dependencias que instalar.

```bash
git clone https://github.com/Michael-ZQ/vvs-u4-normas-iso.git
cd vvs-u4-normas-iso
npm test                                   # 20 pruebas automatizadas
npm run coverage                           # cobertura; falla si las líneas bajan del 80 %
node scripts/evidencia.js mi-ejecucion     # guarda la salida en evidencias/mi-ejecucion.txt
node scripts/flujo-cli.js cm-01            # caso manual CM-01 con transcripción
npm run rendimiento                        # caso CM-02 con 1000 tareas
```

## Fase C · Plan, casos y ejecución

- [`docs/plan-pruebas.md`](docs/plan-pruebas.md): objetivo, alcance, ambiente, riesgos, responsables y criterios (ISO/IEC/IEEE 29119-3)
- [`docs/casos-prueba.md`](docs/casos-prueba.md): 18 casos (8 positivos, 7 negativos o de límite, 3 de recuperación), 16 automatizados
- [`docs/defectos.md`](docs/defectos.md): DEF-01 (media), DEF-02 (alta) y DEF-03 (baja), corregidos con reejecución

| Ejecución | Commit | Resultado | Evidencia |
|---|---|---|---|
| 1 | `7503198` | 14 de 16 automatizadas; 3 defectos | `evidencias/ejecucion-1-inicial.txt` |
| Tras DEF-02 | `b60f4be` | 16 de 17 | `evidencias/ejecucion-2-def02.txt` |
| Tras DEF-01 | `83c5ffc` | 18 de 18 | `evidencias/ejecucion-3-def01.txt` |
| Primer intento DEF-03 | sin commit | 19 de 20 (regresión detectada) | `evidencias/ejecucion-4-regresion-def03.txt` |
| Final | `499e869` | 20 de 20 | `evidencias/ejecucion-5-final.txt` |

## Fase D · Métricas

[`docs/metricas.md`](docs/metricas.md): 100 % de casos ejecutados, 100 % aprobados (83,3 % en la ejecución 1), 0 defectos abiertos y cobertura de líneas de 96,11 %.

## Fase E · Dictamen

[`docs/informe-validacion.md`](docs/informe-validacion.md): **aceptable** para uso personal con un solo proceso. Incluye riesgos residuales y tres mejoras priorizadas.

## Estructura

```
src/          gestor, validación, almacén JSON, errores y CLI
tests/        pruebas node:test (gestor, recuperación y CLI)
docs/         contexto, matriz ISO 25010, criterios, plan, casos, defectos, métricas, dictamen
evidencias/   salida de cada ejecución, cobertura, flujo de la CLI y rendimiento
scripts/      generación de evidencias
```
