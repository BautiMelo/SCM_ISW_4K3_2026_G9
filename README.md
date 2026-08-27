# SCM_ISW_4K3_2026_G9
Repositorio dedicado a gestionar el ciclo de vida del producto de software a desarrollar por el equipo. *(Nombre y descripción del proyecto/producto: a definir)*

## 🔆Integrantes del equipo🔆
| Integrante              | Legajo |
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

## 🔆Instalación🔆
```bash
git clone git@github.com:BautiMelo/SCM_ISW_4K3_2026_G9.git
cd SCM_ISW_4K3_2026_G9
```
*Siempre hacer pull o clonar el repositorio en una nueva carpeta*

**Cómo pullear una rama:**
```bash
git pull origin NombreRamaRemota NombreRamaLocal   # Pullea la rama remota en una rama local
git checkout NombreRamaLocal                       # Me traslado a la rama local recién pulleada
```
o directamente:
```bash
git checkout -b NombreRamaLocal origin/NombreRamaRemota
```

**Al trabajar con el código:** una vez definido el stack tecnológico, se documentará acá el/los comando/s para instalar dependencias (por ejemplo `npm install`, `pip install -r requirements.txt`, etc.).

## 🔆Criterio Línea Base🔆
*A definir por el equipo.* Como referencia, se propone establecer como *Línea Base* el momento en el que se cuente con los primeros *Items de Configuración* estables (por ejemplo, tras la implementación de las primeras User Stories), punto a partir del cual se podrá garantizar trazabilidad e integridad sobre el producto de software en construcción.
Las líneas base se identificarán con una Tag que indicará que dicha rama representa una *Configuración* estable.

## 🔆Items De Configuración🔆
| Listado de Items de Configuración | Regla de Nombrado                              | Ubicación Física                                     |
|------------------------------------|-------------------------------------------------|-------------------------------------------------------|
| User Story                         | `S<X>_US_<X>_<TEMA>.pdf`                        | `Producto/1_Requerimientos/Documentación`             |
| Template Caso Prueba               | `<SIGLA>_TMP_CP_V<X>.xlsx`                      | `Producto/5_Prueba/Documentación`                      |
| Reporte Caso Prueba                | `<SIGLA>_REP_CP_V<X>.xlsx`                      | `Producto/5_Prueba/Documentación`                      |
| Sprint Planning                    | `S<X>_PLAN_<DDMMYYYY>.pdf`                      | `Proyecto/1_Planificación/Sprints`                     |
| Sprint Retro                       | `S<X>_RETRO_<DDMMYYYY>.pdf`                     | `Proyecto/1_Planificación/Sprints`                     |
| Sprint Report                      | `S<X>_REP_<DDMMYYYY>.pdf`                       | `Proyecto/1_Planificación/Sprints`                     |
| Release Planning                   | `R<X>_PLAN_<DDMMYYYY>.pdf`                      | `Proyecto/1_Planificación/Releases`                    |
| Minuta                             | `MIN_TEMA_<DDMMYYYY>.pdf`                       | `Proyecto/2_Monitoreo y Control/Minutas_Reunión`       |
| Reporte                            | `REP_VP<X>_TEMA_<DDMMYYYY>.pdf`                 | `Proyecto/2_Monitoreo y Control/Reportes`              |
| Estructura Equipo                  | `Equipo_<DDMMYYYY>.pdf`                         | `Proyecto`                                             |
| Código                             | `Tipo_Entidad.ext`                              | `Producto/4_Implementación/Código`                     |

## 🔆Glosario🔆
| Sigla                | Significado                                                                                                                       |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `<DDMMYYYY>`          | Fecha en formato día-mes-año en valores numéricos                                                                                  |
| `<X>`                 | Placeholder para indicar un número - adquiere significado cuando se le coloca un prefijo (S - sprint, R - release, etc.)          |
| `<TEMA>`              | Tema sobre lo que trata el Item de Configuración en específico                                                                     |
| S                     | Sprint al que pertenece dicho item de configuración                                                                                |
| R                     | Release al que pertenece dicho item de configuración                                                                               |
| US                    | Indica que dicho item de configuración es una User Story                                                                           |
| TMP                   | Indica que dicho item de configuración es un Template o Plantilla                                                                  |
| CP                    | Siglas para Caso de Prueba                                                                                                         |
| REP                   | Indica que dicho item de configuración es un Reporte                                                                               |
| `<SIGLA>`             | Placeholder para las siglas del proyecto/producto — reemplazar por las siglas reales una vez definido su nombre                    |
| V                     | Sigla para Versión                                                                                                                  |
| PLAN                  | Indica que dicho item de configuración corresponde a una Planificación                                                             |
| RETRO                 | Indica que dicho item de configuración corresponde a una Retro                                                                     |
| MIN                   | Indica que dicho item de configuración corresponde a una Minuta de Reunión                                                         |
| VP                    | Sigla para Versión de Producto                                                                                                     |
| Tipo                  | En el Código, indica de qué se trata dicho archivo: si es una pantalla, un componente, un servicio, etc.                          |
| Entidad               | En el Código, indica de qué entidad se trata dicha pieza de código - ámbito, área o parte del dominio sobre el cual se trabaja    |
| .ext                  | Indica el tipo de archivo - pdf, xlsx, js, ts, etc.                                                                                |

### ®️Reglas de nombrado
En reglas generales, siempre se usará PascalCase para nombrar a las carpetas y a los items de configuración. Además, siempre que se pueda, usaremos palabras en Español. De manera particular se exigirá el cumplimiento de las siguientes reglas:

#### ⬆️Commits
Para los commits hemos decidido utilizar la siguiente nomenclatura: `Prefijo1/DescripciónAcción1_Prefijo2/DescripciónAcción2_..._PrefijoN/DescripciónAcciónN`
- El prefijo hace referencia a las siguientes posibles acciones que se pueden realizar con respecto a items de configuración:
  - **Add**: Agregar un nuevo item de configuración.
  - **Bugfix**: Corregir un error descubierto dentro de un item de configuración que contenga código.
  - **Fix**: Corrección de errores de cualquier tipo dentro de un item de configuración.
  - **Change**: Cambio parcial de un item de configuración ya creado debido a modificaciones de criterio, requerimientos o correcciones.
  - **Feature**: Agregar una nueva funcionalidad dentro de un item de configuración que contenga código.
  - **Remove**: Eliminación completa de algún item de configuración si el mismo se encontraba mal planteado.
  - **Update**: Actualización de un item de configuración ya creado, expandiendo su contenido sin necesariamente haber modificado lo previo.
  - Entre otras acciones. *¡Cualquier propuesta se puede agregar acá!*
- La descripción hará referencia a los items de configuración afectados y a lo que haya sido realizado correspondientemente con el prefijo utilizado.

La idea de esta nomenclatura es tener commits limpios y legibles, en los cuales rápidamente se pueda saber qué se hizo sin necesidad de tener que adentrarse en los cambios.
Ejemplo, para un commit donde se hicieron dos acciones *"Add"* y *"Fix"* sobre uno o varios items de configuración: `Add/Pantalla tramites_Fix/Error de tipeo en la US1`.

#### 🌿Branches
Para las ramas, debido a que se va a trabajar en base a una o varias US y TPs, se decidió seguir la siguiente nomenclatura: `USX_TPX`.
Donde *USX* se refiere a la User Story sobre la que se está trabajando y *TPX* hace referencia al Trabajo Práctico sobre el que se desarrolla dicha actividad.

## 🔆Estructura del repositorio🔆
```
└── SCM_ISW_4K3_2026_G9
    ├── Producto/
    |   ├── 1_Requerimientos/
    |   |   └── Documentación/
    |   |
    |   ├── 2_Análisis/
    |   |
    |   ├── 3_Diseño/
    |   |
    |   ├── 4_Implementación/
    |   |   ├── Código/
    |   |   ├── Datos/
    |   |   └── Documentación/
    |   |
    |   ├── 5_Prueba/
    |   |   └── Documentación/
    |   |
    |   └── 6_Despliegue/
    |
    ├── Proyecto/
    |   ├── 1_Planificación/
    |   |   ├── Sprints/
    |   |   └── Releases/
    |   |
    |   ├── 2_Monitoreo y Control/
    |   |    ├── Minutas_Reunión/
    |   |    └── Reportes/
    |   |
    |   └── Equipo_<DDMMYYYY>.pdf
    |
    └── README.md
```

### 📃Descripción de la estructura
Contamos con dos grandes directorios: Producto y Proyecto. Tanto en *Producto* como en *Proyecto* encontraremos toda la configuración correspondiente al desarrollo del producto de software del equipo, solo que en el primero encontraremos items orientados al desarrollo del producto en sí, y en el segundo, items orientados a la gestión misma del proyecto.

#### ⚙️Producto
Este directorio se divide en 6 carpetas, una por cada actividad en el desarrollo del producto de software que se lleva a cabo. Todas las carpetas comparten una carpeta de documentación asociada o generada en la etapa, pero pueden contar con otras propias de la actividad. Por ejemplo, la carpeta *4_Implementación* cuenta con el directorio *Código*, donde se encontrará toda la estructura del código fuente sobre el que se construye el producto, y también la carpeta *Datos*, que contendrá mockups o bases de datos locales para pruebas.

#### 💡Proyecto
Este directorio consta de 2 carpetas y un documento. En la carpeta *1_Planificación* encontraremos todos los items de configuración referidos a las tareas de gestión de los sprints y releases. Esta se encuentra sujeta a cambios debido a que todavía no se tiene bien definido el marco de trabajo a seguir.
Luego, en la carpeta *2_Monitoreo y Control* encontraremos toda la configuración necesaria para gestionar los reportes, estadísticas y reclamos de la aplicación que se está construyendo.
Finalmente, contamos con un documento *Equipo_&lt;DDMMYYYY&gt;.pdf*, en el cual encontraremos información sobre el equipo de trabajo a lo largo del desarrollo del proyecto. La idea es que funcione como un histórico sobre cómo se fue organizando el equipo a medida que fue trabajando a lo largo del proyecto: qué roles ocupó cada integrante, cuáles fueron sus tareas, sus desafíos y aprendizajes, entre otros factores.
