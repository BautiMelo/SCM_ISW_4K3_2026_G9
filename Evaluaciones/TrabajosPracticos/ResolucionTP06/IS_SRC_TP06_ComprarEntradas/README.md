# EcoHarmony Park — US "Comprar entradas" (TP06 TDD)

Implementación de la User Story **Comprar entradas** con TDD (Red → Green → Refactor).
Decisiones de diseño y bitácora de ciclos: [`../IS_DOC_TP06_DecisionesDeDiseno_v0.1.md`](../IS_DOC_TP06_DecisionesDeDiseno_v0.1.md).

```
IS_SRC_TP06_ComprarEntradas/
├── backend/    API REST en TypeScript (Express) + tests con Jest   ← acá está el TDD
└── frontend/   Web simple en React + Vite que consume la API
```

## Requisitos

- Node.js 20 o superior (`node -v`)

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # y completar los valores (ver abajo)
npm test                  # corre los tests (Jest)
npm run dev               # levanta la API en http://localhost:4000
```

### Variables del `.env` (secretos)

El `.env` **no se sube al repo** (está en `.gitignore`). Cada integrante crea el suyo a partir de `.env.example`.

| Variable | Obligatoria | Para qué |
|---|---|---|
| `JWT_SECRET` | Sí | Firmar los tokens de sesión. Generar uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MP_ACCESS_TOKEN` | Para pagar con tarjeta | Access Token **de prueba** de Mercado Pago |
| `MAIL_USER` / `MAIL_APP_PASSWORD` | Para mails reales | Cuenta de Gmail + contraseña de aplicación. Si se dejan vacías, el mail se imprime en la consola del backend |
| `USUARIO_DEMO_EMAIL` | No | Casilla real donde recibir el mail del usuario demo |
| `PORT`, `FRONTEND_URL` | No | Por defecto `4000` y `http://localhost:5173` |

Sin `MP_ACCESS_TOKEN` ni Gmail la app igual funciona: la compra en **efectivo** anda de punta a punta (con el mail por consola). Con tarjeta, la API responde 500 y el log del backend dice qué falta.

### Credenciales de prueba de Mercado Pago

1. Entrar a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers) → **Tus integraciones** → crear una aplicación (Checkout Pro).
2. En **Cuentas de prueba** crear un usuario **vendedor** y un usuario **comprador**.
3. Iniciar sesión con el **vendedor de prueba**, entrar a la aplicación → **Credenciales de producción** de esa cuenta de prueba: copiar el **Access Token** (`APP_USR-...`) en `MP_ACCESS_TOKEN`.
4. Para pagar, en el checkout iniciar sesión con el **comprador de prueba** y usar una [tarjeta de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards). Con el nombre de titular `APRO` el pago sale aprobado; con `OTHE`, rechazado.

En `localhost` Mercado Pago no vuelve solo a la app: al terminar el pago hay que tocar **"Volver al sitio"**. Ahí se abre `/resultado`, el backend confirma el pago con Mercado Pago y se envía el mail.

## 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:4000
npm run dev               # http://localhost:5173
```

Usuario de prueba: `visitante@ecoharmony.test` / `visitante123`.

## API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/login` | — | `{ email, password }` → `{ token, usuario }` |
| GET | `/compras/fechas-disponibles` | — | Fechas que se pueden elegir en el calendario (`AAAA-MM-DD`) |
| POST | `/compras` | Bearer | `{ fechaVisita: "AAAA-MM-DD", cantidadEntradas, visitantes: [{ edad, tipoPase: "VIP"\|"REGULAR" }], formaPago: "EFECTIVO"\|"TARJETA" }` → `201` con mensaje, cantidad, fecha, monto, código de reserva y `urlPago` (si es tarjeta) |
| POST | `/compras/:codigoReserva/confirmar-pago` | Bearer | `{ idPago }` → confirma el pago con Mercado Pago y envía el mail |

Errores: `400 { mensaje }` si no se cumple un criterio de aceptación, `401` sin sesión, `500` ante fallas inesperadas.
