# SCM_ISW_4K3_2026_G9
Repositorio dedicado a la gestión de configuración de la Materia Ingeniería y Calidad de Software.

Este README es el **Plan de Gestión de Configuración de Software (SCM)** del grupo, y es en sí mismo un Ítem de Configuración (ver punto 5).

## 🔆1. Integrantes del equipo🔆
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

## 🔆2. Estructura Jerárquica del Repositorio🔆
La estructura define únicamente las carpetas del repositorio. Qué ICs van en cada carpeta y cómo se nombran se detalla en la Matriz de Ítems de Configuración (punto 5).

```
SCM_ISW_4K3_2026_G9/
├── InfoGeneral/
│   └── PautasCursado/
│
├── Teoria/
│   └── Unidad<XX>/                  (Unidad01 a Unidad04)
│       ├── MaterialClase/
│       └── NotasClase/
│
├── Practica/
│   ├── NotasClase/
│   └── ResolucionEjercicios/
│
└── Evaluaciones/
    ├── Parciales/
    │   └── Parcial<N>/              (Parcial1 y Parcial2)
    │       ├── Resumenes/
    │       ├── Plantillas/
    │       ├── EjerciciosPractica/
    │       └── Resoluciones/
    │
    └── TrabajosPracticos/
        └── ResolucionTP<XX>/        (solo TPs evaluables: 04, 05, 06, 07, 10, 11, 12 y 13)
```

## 🔆3. Convención de Nombrado de Ítems de Configuración (ICs)🔆
Todos los ICs deben nombrarse según el siguiente patrón:

```
IS_[CATEGORIA]_[DETALLE]_[DESCRIPCION].[EXT]
```

- **IS**: prefijo obligatorio que identifica la asignatura (Ingeniería y Calidad de Software).
- **[CATEGORIA]**: nemónico que clasifica el tipo de artefacto (PTA, CRON, MB, MC, NT, GUIA, NP, EJR, RP, PLP, EJP, REPA, ENUN, DOC, SRC). Ver Glosario.
- **[DETALLE]**: código de contexto o alcance (GEN, U\<XX\>, TP\<XX\>, P\<XX\>, \<DDMM\>).
- **[DESCRIPCION]**: nombre autoexplicativo en PascalCase, sin espacios, guiones, tildes ni caracteres especiales.
- **[EXT]**: extensión del archivo (.pdf, .docx, .txt, .md, .py, .jpeg, etc.).

**Versionado:** el nombre del IC **no** incluye la versión. Las versiones las administra la herramienta (Git): cada cambio a un IC queda registrado como un commit, y las configuraciones estables se identifican con tags de Línea Base (punto 6).

## 🔆4. Glosario🔆

| **Abreviación** | **Significado / Concepto** | **Descripción y Alcance** |
| ---   | ---                        | --- |
| IS    | Ingeniería de Software     | Prefijo institucional común para todos los artefactos de la asignatura |
| PTA   | Pautas de Cursado          | Reglamentos, condiciones de regularidad y normativas de cátedra |
| CRON  | Cronograma                 | Calendario oficial de clases, entregas y exámenes |
| MB    | Bibliografía               | Libros, papers y material de referencia |
| MC    | Material de Clase          | Presentaciones y material teórico de la cátedra |
| NT    | Notas Teóricas             | Apuntes tomados en clases teóricas |
| GUIA  | Guía                       | Documento macro con todos los ejercicios prácticos o todos los TPs |
| NP    | Notas Prácticas            | Apuntes tomados en clases prácticas |
| EJR   | Ejercicios Resueltos       | Resoluciones de los TPs no evaluables, hechos en clase |
| RP    | Resumen para Parcial       | Síntesis de conceptos para parciales |
| PLP   | Plantilla de Parcial       | Modelos y plantillas de examen |
| EJP   | Ejercicios de Parcial      | Simulacros y bancos de ejercicios |
| REPA  | Resolución de Parcial      | Soluciones y pautas de corrección |
| ENUN  | Enunciado de TP            | Consignas oficiales de cada TP |
| DOC   | Documentación              | Informes, planes de gestión, manuales y demás entregables documentales |
| SRC   | Código Fuente              | Scripts y módulos de programación entregados en un TP |
| GEN   | General                    | Alcance global para toda la materia |
| U[XX] | Unidad Temática            | Identificador de unidad (U01 a U04) |
| TP[XX]| Trabajo Práctico           | Identificador de TP (TP01 a TP13) |
| P[XX] | Parcial                    | Identificador de parcial (P01, P02) |
| DDMM  | Fecha                      | Día y mes de la clase en la que se tomaron las notas (ej. 1408) |

## 🔆5. Matriz de Ítems de Configuración (IC)🔆

### Tipos de ítem
Se usan los tipos de ítem genéricos de la teoría de SCM, que se distinguen por su ciclo de vida:

| **Tipo** | **Criterio** |
| --- | --- |
| **Producto** | Conocimiento de la materia que perdura más allá de la cursada (material teórico y práctico, bibliografía, apuntes). |
| **Proyecto** | Vive durante toda la cursada 2026 y la gestiona (pautas, cronograma, plan de SCM, configuración del repositorio). |
| **Iteración** | Asociado a una entrega o evaluación puntual (un TP o un parcial). |

### Matriz
La regla de nombrado se expresa con los mismos marcadores que la convención del punto 3. La ubicación física es la ruta completa desde la raíz del repositorio.

| **NOMBRE DE IC** | **REGLA DE NOMBRADO** | **UBICACIÓN FÍSICA** | **TIPO DE ÍTEM** |
| --- | --- | --- | --- |
| Plan de Gestión de Configuración | README.md | SCM_ISW_4K3_2026_G9/ | Proyecto |
| Plan de Gestión de Configuración (formato formal) | IS_DOC_GEN_PlanGestionConfiguracion.pdf | SCM_ISW_4K3_2026_G9/ | Proyecto |
| Archivos ignorados por Git | .gitignore | SCM_ISW_4K3_2026_G9/ | Proyecto |
| Pautas de Cursado | IS_PTA_GEN_\<Descripcion\>.pdf | SCM_ISW_4K3_2026_G9/InfoGeneral/PautasCursado/ | Proyecto |
| Cronograma de Clases | IS_CRON_GEN_\<Descripcion\>.txt | SCM_ISW_4K3_2026_G9/InfoGeneral/ | Proyecto |
| Bibliografía | IS_MB_GEN_\<Descripcion\>.txt | SCM_ISW_4K3_2026_G9/Teoria/ | Producto |
| Material de Clase Unidad 1 | IS_MC_U01_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Teoria/Unidad01/MaterialClase/ | Producto |
| Notas Teóricas Unidad 1 | IS_NT_\<DDMM\>_Notas\<Autor\>.txt | SCM_ISW_4K3_2026_G9/Teoria/Unidad01/NotasClase/ | Producto |
| Material de Clase Unidad 2 | IS_MC_U02_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Teoria/Unidad02/MaterialClase/ | Producto |
| Notas Teóricas Unidad 2 | IS_NT_\<DDMM\>_Notas\<Autor\>.txt | SCM_ISW_4K3_2026_G9/Teoria/Unidad02/NotasClase/ | Producto |
| Material de Clase Unidad 3 | IS_MC_U03_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Teoria/Unidad03/MaterialClase/ | Producto |
| Notas Teóricas Unidad 3 | IS_NT_\<DDMM\>_Notas\<Autor\>.txt | SCM_ISW_4K3_2026_G9/Teoria/Unidad03/NotasClase/ | Producto |
| Material de Clase Unidad 4 | IS_MC_U04_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Teoria/Unidad04/MaterialClase/ | Producto |
| Notas Teóricas Unidad 4 | IS_NT_\<DDMM\>_Notas\<Autor\>.txt | SCM_ISW_4K3_2026_G9/Teoria/Unidad04/NotasClase/ | Producto |
| Guía de Ejercicios Prácticos | IS_GUIA_GEN_\<Descripcion\>.pdf | SCM_ISW_4K3_2026_G9/Practica/ | Producto |
| Notas Prácticas | IS_NP_\<DDMM\>_Notas\<Autor\>.txt | SCM_ISW_4K3_2026_G9/Practica/NotasClase/ | Producto |
| Resolución de TP no evaluable | IS_EJR_TP\<XX\>_\<Descripcion\>.\<ext\> | SCM_ISW_4K3_2026_G9/Practica/ResolucionEjercicios/ | Iteración |
| Resumen Parcial 1 | IS_RP_P01_\<Descripcion\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/Resumenes/ | Iteración |
| Plantilla Parcial 1 | IS_PLP_P01_\<Tipo\>.\<ext\> | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/Plantillas/ | Iteración |
| Ejercicio Práctica Parcial 1 | IS_EJP_P01_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/EjerciciosPractica/ | Iteración |
| Resolución Parcial 1 | IS_REPA_P01_\<TemaResolucion\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial1/Resoluciones/ | Iteración |
| Resumen Parcial 2 | IS_RP_P02_\<Descripcion\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial2/Resumenes/ | Iteración |
| Plantilla Parcial 2 | IS_PLP_P02_\<Tipo\>.\<ext\> | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial2/Plantillas/ | Iteración |
| Ejercicio Práctica Parcial 2 | IS_EJP_P02_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial2/EjerciciosPractica/ | Iteración |
| Resolución Parcial 2 | IS_REPA_P02_\<TemaResolucion\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/Parciales/Parcial2/Resoluciones/ | Iteración |
| Guía de Trabajos Prácticos | IS_GUIA_GEN_\<Descripcion\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/TrabajosPracticos/ | Producto |
| Enunciado de TP | IS_ENUN_TP\<XX\>_\<Tema\>.pdf | SCM_ISW_4K3_2026_G9/Evaluaciones/TrabajosPracticos/ | Iteración |
| Documentación de Resolución de TP | IS_DOC_TP\<XX\>_\<Descripcion\>.\<ext\> | SCM_ISW_4K3_2026_G9/Evaluaciones/TrabajosPracticos/ResolucionTP\<XX\>/ | Iteración |
| Código Fuente de Resolución de TP | IS_SRC_TP\<XX\>_\<Descripcion\>.\<ext\> | SCM_ISW_4K3_2026_G9/Evaluaciones/TrabajosPracticos/ResolucionTP\<XX\>/ | Iteración |

**Notas:**
- La ubicación de la resolución de un TP depende de si la Guía de TPs lo marca como evaluable:
  - **TPs evaluables** (04, 05, 06, 07, 10, 11, 12 y 13): categoría `DOC`/`SRC` en `Evaluaciones/TrabajosPracticos/ResolucionTP<XX>/`, donde `<XX>` coincide con el número de la carpeta (ej. `IS_DOC_TP07_DinamicaScrum.jpeg` va en `ResolucionTP07/`).
  - **TPs no evaluables** (01, 02, 03, 08 y 09): categoría `EJR` en `Practica/ResolucionEjercicios/`.
- Los archivos `.gitkeep` no son ICs: solo sirven para que Git conserve las carpetas vacías de la estructura.

## 🔆6. Definición de Líneas Base (Baselines) y Flujo de Control🔆
Una Línea Base es una configuración de ICs formalmente aprobada, que sirve de base para el trabajo siguiente y solo se modifica mediante el control de cambios.

**Criterios de creación:**
1. La primera línea base se establece al terminar la configuración inicial del repositorio, correspondiente al Trabajo Práctico número 4. Se identifica con el tag `BL-TP04`, y congela la estructura física del repositorio, las pautas de cursado, el cronograma oficial y la bibliografía inicial de referencia de la cátedra.
2. De ahí en adelante, se establece una línea base al finalizar cada trabajo práctico, una vez que fue corregido y aprobado por un profesor de la cátedra. Se identifica con un tag `BL-TP<XX>`.

**Identificación:** cada línea base es un tag anotado de Git sobre el commit que representa la configuración estable, con el nombre de la línea base y una breve descripción de su alcance.

**Líneas base establecidas:**

| **Tag** | **Descripción** |
| --- | --- |
| BL-TP04 | Línea base inicial: configuración del repositorio (TP04) |
| BL-TP07 | Resolución del TP07: dinámica Scrum para la elaboración de maquetas |
