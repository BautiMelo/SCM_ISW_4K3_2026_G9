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
```
```
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