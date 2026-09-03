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

SCM_ISW_4K3_2026_G9/
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
```
Todos los Ítems de Configuración (ICs) deben construirse siguiendo la siguiente convención estándar:

IS_[CATEGORIA]_[DETALLE]_[DESCRIPCION]_[VERSION].[EXT]

IS → Prefijo obligatorio que identifica la asignatura (Ingeniería de Software).

[CATEGORIA] → Nemónico o código de abreviación normalizado que clasifica el tipo de artefacto (ej. PTA, CRON, MB, MC, NT, GUIA, NP, EJR, RP, PLP, EJP, REPA, ENUN, DOC, SRC, BLD).

[DETALLE] → Código de contexto o alcance (ej. GEN, U01, U02, TP01, TP02, TP03, P01, P02, DDMM).

[DESCRIPCION] → Nombre semántico y autoexplicativo del artefacto, escrito en PascalCase, sin espacios ni caracteres especiales.

[VERSION] → Notación semántica vX.Y (donde v0.1 a v0.9 representa versiones en progreso/borrador, y v1.0 en adelante representa versiones aprobadas/bajo línea base).

[EXT] → Extensión de archivo formal (.pdf, .docx, .md, .py, .sh, etc.).
```

## 🔆Matriz Exhaustiva de Ítems de Configuración (IC)🔆

**Regla de nombrado general:** `IS_[CATEGORIA]_[DETALLE]_[DESCRIPCION]_[VERSION].[EXT]`

| **NOMBRE DE IC** | **REGLA DE NOMBRADO** | **UBI FÍSICA** | **ÍTEM DEL PRODUCTO** |
| --- | --- | --- | --- |
| Pautas de Cursado | IS_PTA_GEN_\<Descripcion\>_v1.0.pdf | SCM_ISW_4K3_2026_G9/InfoGeneral/PautasCursado | Documento de pautas |
| Cronograma de Clases | IS_CRON_GEN_CronogramaClases_v1.0.txt | SCM_ISW_4K3_2026_G9/InfoGeneral/ | Cronograma oficial |
| Bibliografía Obligatoria | IS_MB_GEN_LinkBibliografia_v1.0.txt | SCM_ISW_4K3_2026_G9/Teoria/ | Bibliografía |
| Material Clase U1 | IS_MC_U01_\<Descripcion\>_v1.0.pdf | SCM_ISW_4K3_2026_G9/Teoria/Unidad01/MaterialClase | Presentación de clase |
| Notas Clase U1 | IS_NT_\<DDMM\>_NotasClase_v1.0.txt | SCM_ISW_4K3_2026_G9/Teoria/Unidad01/NotasClase | Apuntes teóricos |
| Guía de TPs (Práctica) | IS_GUIA_GEN_GuiaEjerciciosPracticos_v1.0.pdf | SCM_ISW_4K3_2026_G9/Practica/ | Guía práctica |
| Notas Práctica | IS_NP_\<DDMM\>_Notas\<Nombre\>_v1.0.txt | SCM_ISW_4K3_2026_G9/Practica/NotasClase | Apuntes prácticos |
| Ejercicio Resuelto TP | IS_EJR_TP\<NN\>_ResolucionEjercicio\<N\>_\<Nombre\>_v1.0.py | SCM_ISW_4K3_2026_G9/Practica/ResolucionEjercicios | Código fuente |
| Resumen Parcial 1 | IS_RP_P01_\<Descripcion\>_v1.0.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/Resumenes | Resumen teórico |
| Ejercicio Práctica Parcial 1 | IS_EJP_P01_\<Descripcion\>_v1.0.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/EjerciciosPractica | Enunciado práctico |
| Plantilla Parcial 1 | IS_PLP_P01_Modelo_v1.0.docx | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/Plantillas | Plantilla examen |
| Resolución Parcial 1 | IS_REPA_P01_Resolucion_v1.0.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/Resoluciones | Resolución oficial |
| Guía de TPs (Evaluaciones) | IS_GUIA_GEN_GuiaTPs_v1.0.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/TrabajosPracticos/ | Guía de trabajos prácticos |
| Resolución TP01 | IS_DOC_TP01_\<Descripcion\>_v1.0.\<ext\> | SCM_ISW_4K3_2026_G9/Evaluaciones/TrabajosPracticos/ResolucionTP01 | Informe y/o código fuente |
| README del repositorio | README.md | SCM_ISW_4K3_2026_G9/ | Documento de presentación del repositorio |

**Notas sobre estructuras repetidas:**
- **Teoria/Unidad01** se desarrolló como ejemplo completo (Material Clase + Notas Clase). **Unidad02, Unidad03 y Unidad04** siguen exactamente la misma estructura y regla de nombrado, reemplazando `U01` por `U02`, `U03` o `U04` respectivamente en el DETALLE.
- **Evaluaciones/Parciales/Parcial1** se desarrolló como ejemplo completo (Resumen, Ejercicio Práctica, Plantilla, Resolución). **Parcial2** sigue la misma estructura, reemplazando `P01` por `P02`.
- **Evaluaciones/TrabajosPracticos/ResolucionTP01** se desarrolló como ejemplo. **ResolucionTP02 a ResolucionTP13** siguen la misma estructura y regla de nombrado, reemplazando `TP01` por el número de TP correspondiente (`TP02`...`TP13`).



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
| DDMM  | Fecha                      | Formato de fecha en dia y mes |

## 🔆Definición de Líneas Base (Baselines) y Flujo de Control🔆
```
El criterio que vamos a utilizar para la creación de las líneas base va a ser:

    1. La primer línea base se establece al terminar la configuración inicial del repositorio, correspondiente al Trabajo Práctico número 4. La misma será indicada con una Tag llamada "BL-TP04".
    2. De ahí en adelante, se establecerán después de finalizar un trabajo práctico, una vez el mismo se encuentre corregido y aprobado por un profesor de la cátedra. Las mismas serán indicadas con Tags del tipo: "BL-TP<numeroTp>".

Las líneas base se identificarán con una Tag que indicará que dicho commit representa una Configuración estable. Las mismas llevarán el nombre de la línea base, más una pequeña descripción.

### Ej: Línea Base Inicial: BL-INIT:

Criterio: Congela la estructura física del repositorio, las pautas de cursado, el cronograma oficial y la bibliografía inicial de referencia de la cátedra.
```
