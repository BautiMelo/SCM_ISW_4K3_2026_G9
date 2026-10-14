# TP06 — TDD: User Story "Comprar entradas"

**Grupo 9 — Ingeniería y Calidad de Software 2026 — 4K3**
Código: [`IS_SRC_TP06_ComprarEntradas/`](IS_SRC_TP06_ComprarEntradas/) · Rama: `US8_TP6`

## 1. User Story

> **COMO** visitante **QUIERO** comprar una entrada **PARA** asegurar mi visita al parque. *(8 puntos)*

**Criterios de aceptación:**
1. Debe indicar la fecha de visita deseada, la cantidad de entradas requeridas, la edad de cada visitante y el tipo de pase (VIP o regular).
2. La fecha de visita puede ser del día actual o futuro.
3. Debe enviar un mensaje de confirmación vía mail.
4. Debe redirigir a Mercado Pago al confirmar la compra si el pago es con tarjeta de crédito.
5. La fecha de la visita debe estar dentro de los días en que el parque está abierto.
6. Debe seleccionar la forma de pago: efectivo (pago en boletería) o tarjeta.
7. La cantidad de entradas requeridas no debe ser mayor a 10.
8. Al finalizar la compra se debe informar la cantidad de entradas compradas y la fecha.
9. Se debe permitir la compra de entradas solo a usuarios registrados.

## 2. Enfoque TDD aplicado

Cada criterio se construyó con el ciclo **Red → Green → Refactor**, y **cada paso es un commit** de la rama `US8_TP6`, así el ciclo se puede seguir en el historial:

- **Red:** se escribe un test que expresa el criterio y se corre para verlo fallar. El fallo tiene que ser por la razón esperada, por ejemplo "la compra se resolvió cuando debía rechazarse".
- **Green:** se escribe el código mínimo para que el test pase, sin romper los anteriores.
- **Refactor:** con todos los tests en verde, se mejora el diseño (nombres, duplicación, funciones auxiliares) sin cambiar el comportamiento.

### Bitácora de ciclos

| # | Criterio | Red (test que falla) | Green (código mínimo) | Refactor |
|---|---|---|---|---|
| 1 | CA 8 — informar cantidad y fecha | `d1112d6` falla porque `comprarEntradas` no existe | `7ee667a` devuelve el mensaje | `bdcfe8e` helper `crearSolicitudValida` en los tests |
| 2 | CA 6 — forma de pago | `6cfb82c` la compra sin forma de pago se resolvía | `a6da764` valida EFECTIVO/TARJETA | — |
| 3 | CA 5 — días de apertura | `d177f69` se vendía para martes y jueves | `8f56fe9` rechaza martes y jueves | `f7d7a09` extrae `validarFormaPago` y `validarDiaApertura` |
| 4 | CA 7 — máximo 10 entradas | `f458fef` 11, 0 y 2.5 entradas pasaban | `cedb31b` entero entre 1 y 10 | — |
| 5 | CA 2 — hoy o futuro | `06c3c74` fechas pasadas y mal formadas pasaban | `fadeaee` valida formato y que no sea anterior a hoy | — |
| 5b | CA 2 — fecha inexistente | `9b26f03` **el 31/02 se vendía como 03/03** | `e6ebbd2` rechaza fechas inexistentes | — |
| 6 | CA 9 — usuario registrado | `fc2bbdc` sin usuario la compra pasaba | `3475bc6` exige usuario | — |
| 7 | CA 1 — edad y pase de cada visitante | `dd5cc9d` 6 casos inválidos pasaban | `5c46059` valida cada visitante | `7e6c546` `CompraError`, constantes de límites, `validarUsuario` |
| 8 | Monto total (relevamiento) | `9467a03` `calcularMontoTotal` no existía | `c10117e` precios y descuentos | — |
| 9 | CA 3 — mail de confirmación | `79ba307` no se enviaba mail | `a6c4271` envía mail con código de reserva | — |
| 10 | CA 4 — redirigir a Mercado Pago | `58be9fd` no se creaba el pago | `c94a60d` crea el pago y devuelve la URL | — |
| 11 | CA 3 + 4 — confirmar pago con tarjeta | `0c39f57` no había `confirmarPago` | `c6d39aa` verifica el pago, marca PAGADA y envía el mail | `a163922` unifica cómo se arman el resultado y el mail |
| 12 | CA 9 en la API (HTTP) | `1048995` no existía la API | `0afaa67` login JWT, `POST /compras`, errores 400/401/500 | `443dc97` no enviar el email del comprador a Mercado Pago |

El ciclo 5b muestra el valor de pensar valores límite antes de escribir el código. Un test con el 31 de febrero descubrió que `Date` "corrige" fechas inválidas en silencio, y el sistema vendía entradas para un día que no existe.

## 3. Pruebas de usuario de la US → tests automatizados

| Prueba de usuario | Test(s) |
|---|---|
| Comprar con fecha disponible, < 10 entradas, edades, tipo de pase, tarjeta (Mercado Pago) y mail de confirmación **(pasa)** | `la compra con tarjeta crea el pago en Mercado Pago y devuelve la URL para redirigir` + `con el pago aprobado la compra queda PAGADA, informa cantidad y fecha y envía el mail` |
| Comprar sin seleccionar forma de pago **(falla)** | `comprar sin seleccionar forma de pago falla` |
| Comprar con fecha en que el parque está cerrado **(falla)** | `comprar para un martes (parque cerrado) falla`, `... jueves ...` |
| Comprar más de 10 entradas **(falla)** | `comprar más de 10 entradas falla` (+ límites: 10 pasa, 0 falla) |

En total hay **46 tests**: 41 del servicio de compra y 5 de la API. El servicio `compraService.ts` tiene 100% de cobertura (`npm run test:coverage`).

## 4. Decisiones de diseño

**4.1 La lógica de negocio vive en una función pura y testeable.**
`comprarEntradas(solicitud, dependencias)` en `backend/src/services/compraService.ts` concentra todos los criterios de aceptación. No conoce Express, ni Gmail, ni Mercado Pago. El controller HTTP solo traduce request/response.

En el trabajo de 2025 las validaciones estaban repartidas entre pantallas y controller, y no se podían testear. Con esta separación cada criterio tiene su test unitario.

**4.2 Función principal + funciones auxiliares**, siguiendo el formato de la guía TDD de la cátedra (`inscribirseAActividad` + `validarFecha`, ...).
La función principal es `comprarEntradas`, que valida y después registra, cobra y notifica. Las auxiliares son `validarUsuario`, `validarFormaPago`, `validarFechaVisita`, `validarDiaApertura`, `validarCantidadEntradas`, `validarVisitantes` y `calcularMontoTotal`. Cada una tiene una única responsabilidad y se exporta para poder probarla aislada.

**4.3 Errores de negocio con mensaje para el usuario.**
Cada criterio incumplido lanza un `CompraError` con un mensaje claro ("La cantidad de entradas debe ser un número entero entre 1 y 10"). La API lo traduce a `400 { mensaje }`, y el frontend muestra ese mensaje tal cual. Cualquier otro error es una falla técnica: se responde `500` sin exponer detalles internos.

**4.4 Inyección de dependencias para poder testear sin efectos reales.**
Las dependencias externas se pasan como parámetro (`DependenciasCompra`):
- la fecha actual,
- el `enviadorMail`,
- la `pasarelaPago` (Mercado Pago),
- el `repositorioCompras`.

En los tests se reemplazan por **dobles** (`jest.fn()`). Así se puede verificar *que se envió el mail y con qué contenido* sin mandar mails, y *que se pidió el cobro y por cuánto* sin cobrar. La **fecha actual fija** (lunes 12/10/2026) hace que los tests den el mismo resultado cualquier día que se corran.

**4.5 Con tarjeta, el mail se envía recién cuando Mercado Pago aprueba el pago.**
Mandar "compra confirmada" antes de cobrar sería incorrecto. Por eso la compra con tarjeta queda `PENDIENTE_PAGO`. Cuando Mercado Pago devuelve al usuario, `confirmarPago` **consulta a Mercado Pago** el estado real del pago (no confía en los parámetros de la URL), verifica que el pago corresponda a esa compra (`external_reference`) y recién ahí la marca `PAGADA` y envía el mail. Si se confirma dos veces, por ejemplo porque el usuario recarga la página, no se reenvía el mail.

**4.6 Secretos fuera del código.**
El Access Token de Mercado Pago, el JWT secret y las credenciales de Gmail se leen del `.env`, que está en `.gitignore`. En el repo solo está `.env.example`. En el trabajo de 2025 estos valores estaban escritos en el código.

**4.7 Fechas sin corrimientos de zona horaria.**
La fecha viaja como texto `AAAA-MM-DD` y se interpreta en hora local. `new Date('AAAA-MM-DD')` la toma en UTC, y en Argentina eso puede correrla al día anterior y validar mal el día de apertura.

**4.8 Sin base de datos.**
Usuarios y compras son mocks en memoria (`src/data`), igual que en el trabajo de 2025. El repositorio está detrás de la interfaz `RepositorioCompras`, así que reemplazarlo por una base real no cambia el servicio.

## 5. Supuestos (a validar con el PO)

| Supuesto | Fuente |
|---|---|
| El parque abre todos los días excepto martes y jueves (también feriados) | Relevamiento con el PO, EcoHarmony 2025 |
| Precios: Regular $6.000, VIP $10.000; menores de 12 y jubilados pagan 50% | Relevamiento con el PO, EcoHarmony 2025 |
| Edad válida: entero entre 0 y 120 | Definición del equipo (la US no la acota) |
| La cantidad de entradas debe coincidir con la cantidad de visitantes cargados | Derivado del CA 1 ("la edad de cada visitante") |

**Fuera de alcance:**
- Límite de compra de hasta 6 meses de anticipación.
- Corte de compra para el mismo día, una hora antes del cierre. No hay un horario de cierre definido.
- QR en el mail.
- Webhooks de Mercado Pago.

Ninguno figura en los criterios de aceptación de la US.

## 6. Qué no se testea automáticamente y por qué

Los adaptadores reales `integraciones/mailGmail.ts` y `integraciones/mercadoPago.ts` dependen de servicios externos y de credenciales, así que se verifican a mano de punta a punta (ver `IS_SRC_TP06_ComprarEntradas/README.md`). Su lógica es mínima: traducen la interfaz del dominio a la API de cada proveedor. Toda decisión de negocio está en `compraService.ts`, que sí está cubierto al 100%.
