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

IS-SCM-Repositorio/
├── InfoGeneral/
│   ├── PautasCursado/
│   │   └── IS_PTA_GEN_<Tema>_v<X.Y>.pdf
│   └── IS_CRON_GEN_<Descripcion>_v<X.Y>.txt
│
├── Teoria/
│   ├── IS_MB_GEN_<Descripcion>_v<X.Y>.txt
│   ├── Unidad<NroUnidad>/
│   │   ├── MaterialClase/
│   │   │   └── IS_MC_U<XX>_<Tema>_v<X.Y>.pdf
│   │   └── NotasClase/
│   │       └── IS_NT_U<XX>_<Descripcion>_v<X.Y>.txt
│
├── Practica/
│   ├── IS_GUIA_GEN_<Descripcion>_v<X.Y>.pdf
│   ├── NotasClase/
│   │   └── IS_NP_GEN_<Descripcion>_v<X.Y>.txt
│   └── ResolucionEjercicios/
│       └── IS_EJR_TP<XX>_<EjercicioAlumno>_v<X.Y>.<ext>
│
└── Evaluaciones/
    ├── Parciales/
    │   ├── Parcial<NroParcial>/
    │   │   ├── Resumenes/
    │   │   │   └── IS_RP_P<N>_<Tema>_v<X.Y>.pdf
    │   │   ├── Plantillas/
    │   │   │   └── IS_PLP_P<N>_<Tipo>_v<X.Y>.<ext>
    │   │   ├── EjerciciosPractica/
    │   │   │   └── IS_EJP_P<N>_<Tema>_v<X.Y>.pdf
    │   │   └── Resoluciones/
    │   │       └── IS_REPA_P<N>_<TemaResolucion>_v<X.Y>.pdf
    │
    └── TrabajosPracticos/
        ├── IS_ENUN_TP<XX>_<Tema>v<X.Y>.pdf
        └── Resolucion<NroTp>/
            └── IS_DOC_TP<XX>_<Descripcion>_v<X.Y>.<ext>
        
```
## 🔆Regla General de Nombrado de Ítems de Configuración🔆
Todos los Ítems de Configuración (ICs) deben construirse siguiendo la siguiente convención estándar:

IS_[CATEGORIA]_[DETALLE]_[DESCRIPCION]_[VERSION].[EXT]

IS → Prefijo obligatorio que identifica la asignatura (Ingeniería de Software).
[CATEGORIA] → Nemónico o código de abreviación normalizado que clasifica el tipo de artefacto (ej. PTA, CRON, MB, MC, NT, GUIA, NP, EJR, RP, PLP, EJP, REPA, ENUN, DOC, SRC, BLD).
[DETALLE] → Código de contexto o alcance (ej. GEN, U01, U02, TP01, TP02, TP03, P01, P02).
[DESCRIPCION] → Nombre semántico y autoexplicativo del artefacto, escrito en PascalCase, sin espacios ni caracteres especiales.
[VERSION] → Notación semántica vX.Y (donde v0.1 a v0.9 representa versiones en progreso/borrador, y v1.0 en adelante representa versiones aprobadas/bajo línea base).
[EXT] → Extensión de archivo formal (.pdf, .docx, .md, .py, .sh, etc.).

## 🔆Matriz Exhaustiva de Ítems de Configuración (IC)🔆



## 🔆Glosario🔆

| **Abreviación** | **Significado / Concepto** | **Descripción y Alcance** |
| ---   | ---                        | --- |
| IS    | Ingeniería de Software     | Prefijo institucional común para todos los artefactos de la asignatura |
| PTA   | Pautas de Cursado          | Reglamentos, condiciones de regularidad y normativas de cátedra |
| CRON  | Cronograma                 | Calendario oficial de clases, entregas y exámenes |
| MB    | Bibliografía               | Libros, papers y material de referencia |
| MC    | Material de Clase          | Presentaciones y guías teóricas |
| NT    | Notas Teóricas             | Apuntes y registros de clases teóricas |
| GUIA  | Guía de Trabajos Prácticos | Documento macro con todos los TPs |
| NP    | Notas Prácticas            | Apuntes de las clases prácticas |
| EJR   | Ejercicios Resueltos       | Soluciones de ejercicios prácticos |
| RP    | Resumen para Parcial       | Síntesis de conceptos para parciales |
| PLP   | Plantilla de Parcial       | Modelos y plantillas de examen |
| EJP   | Ejercicios de Parcial      | Simulacros y bancos de ejercicios |
| REPA  | Resolución de Parcial      | Soluciones y pautas de corrección |
| ENUN  | Enunciado de TP            | Consignas oficiales de cada TP |
| DOC   | Documentación Técnica      | Informes, planes de gestión y manuales |
| SRC   | Código Fuente              | Scripts y módulos de programación |
| BLD   | Build y Automatización     | Scripts de compilación e integración continua |
| GEN   | General                    | Alcance global para toda la materia |
| U[XX] | Unidad Temática            | Identificador de unidad (ej. U01, U02, U03) |
| TP[XX]| Trabajo Práctico           | Identificador de TP (ej. TP01, TP02, TP03) |
| P[XX] | Parcial                    | Identificador de parcial (ej. P01, P02) |

## 🔆Definición de Líneas Base (Baselines) y Flujo de Control🔆

El criterio que vamos a utilizar para la creación de las líneas base va a ser:

    1. La primer línea base se establece al terminar la configuración inicial del repositorio, correspondiente al Trabajo Práctico número 4. La misma será indicada con una Tag llamada "BL-TP04".
    2. De ahí en adelante, se establecerán después de finalizar un trabajo práctico, una vez el mismo se encuentre corregido y aprobado por un profesor de la cátedra. Las mismas serán indicadas con Tags del tipo: "BL-TP<numeroTp>".

Las líneas base se identificarán con una Tag que indicará que dicho commit representa una Configuración estable. Las mismas llevarán el nombre de la línea base, más una pequeña descripción.

### Ej: Línea Base Inicial: BL-INIT:

Criterio: Congela la estructura física del repositorio, las pautas de cursado, el cronograma oficial y la bibliografía inicial de referencia de la cátedra.