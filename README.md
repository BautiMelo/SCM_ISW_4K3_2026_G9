# SCM_ISW_4K3_2026_G9
Repositorio dedicado a la gestión de configuración de la Materia Ingeniería y Calidad de Software

## 🔆Integrantes del equipo🔆
| Integrante               | Legajo |
|--------------------------|--------|
| Michelazzo, Francisco    | 400974 |
| Stutz, Santiago          | 401863 |
| Becerra, Maximo          | 403564 |
| Melo, Bautista           | 401860 |
| Guzman, Julieta          | 89894  |
| Savarino, Sofia          | 401547 |
| Bottari, Juan            | 400146 |
| Sellan, Franco Ernesto   | 89970  |
| Toselli, Gabriel         | 403313 |
| Naya, Leo                | 402326 |
| Gomez, Luciano           | 89058  |
| Bottari, Lucca           | 82359  |

## 🔆Estructura Jerárquica del Repositorio🔆
```
IS-SCM-Repositorio/
├── InfoGeneral/
│   ├── PautasCursado/
│   │        ├── <NombrePauta>.pdf
│   └── Cronograma.txt
│
├── Teoria/
│   ├── Bibliografia.txt
│   ├── Unidad<NroUnidad>/
│   │   ├── MaterialClase/
|   |           ├─ <NombrePresentacion>.pdf
│   │   └── NotasClase/
│   │      ├── notas_<DiaMes>_<NombreAlumno>.txt
│
├── Practica/
│   ├── GuiaTrabajosPracticos.pdf
│   ├── NotasClase/
│   │      ├── notas_<DiaMes>_<NombreAlumno>.txt
│   └── ResolucionEjercicios/
│          ├── Resolucion_<NombreEjercicio>_<NombreAlumno>.ext
│
└── Evaluaciones/
    ├── Parciales/
    │   ├── Parcial<NroParcial>/
    │      ├── Resumenes/
    │      │      ├── <NombeResumen>.pdf
    │      ├── Plantillas/
    │      │      ├── <NombrePlantilla>.ext
    │      ├── EjerciciosPractica/
    │      │      ├── <NombreEnunciado>.pdf
    │      └── Resoluciones/
    |              ├── <NombreResolucion>.pdf
    └── TrabajosPracticos/
        ├── <GuiaTP>.pdf
        ├── Resolucion_<NroTp>/
            ├── <NombreResolucion>.ext
        
```
## 🔆Regla General de Nombrado de Ítems de Configuración🔆
Todos los Ítems de Configuración (ICs) deben construirse siguiendo la siguiente convención estándar:

IS_[CATEGORIA]_[DETALLE]_[DESCRIPCION]_[VERSION].[EXT]

IS → Prefijo obligatorio que identifica la asignatura (Ingeniería de Software).
[CATEGORIA] → Nemónico o código de abreviación normalizado que clasifica el tipo de artefacto (ej. PTA, CRON, MB, MC, NT, GUIA, NP, EJR, RP, PLP, EJP, REPA, ENUN, DOC, SRC, BLD).
[DETALLE] → Código de contexto o alcance (ej. GEN, U01, U02, TP01, TP02, TP03, P01, P02).
[DESCRIPCION] → Nombre semántico y autoexplicativo del artefacto, es crito en PascalCase, sin espacios ni caracteres especiales.
[VERSION] → Notación semántica vX.Y (donde v0.1 a v0.9 representa versiones en progreso/borrador, y v1.0 en adelante representa versiones aprobadas/bajo línea base).
[EXT] → Extensión de archivo formal (.pdf, .docx, .md, .py, .sh, etc.).

## 🔆Matriz Exhaustiva de Ítems de Configuración (IC)🔆
```
```
## 🔆Glosario🔆
```
```
## 🔆Definición de Líneas Base (Baselines) y Flujo de Control🔆

El criterio que vamos a utilizar para la creación de las líneas base va a ser:

    1. La primer línea base se establece al terminar la configuración inicial del repositorio, correspondiente al Trabajo Práctico número 4. La misma será indicada con una Tag llamada "BL-TP04".
    2. De ahí en adelante, se establecerán después de finalizar un trabajo práctico, una vez el mismo se encuentre corregido y aprobado por un profesor de la cátedra. Las mismas serán indicadas con Tags del tipo: "BL-TP<numeroTp>".

Las líneas base se identificarán con una Tag que indicará que dicho commit representa una Configuración estable. Las mismas llevarán el nombre de la línea base, más una pequeña descripción.

### Ej: Línea Base Inicial: BL-INIT:

Criterio: Congela la estructura física del repositorio, las pautas de cursado, el cronograma oficial y la bibliografía inicial de referencia de la cátedra.