# EcoHarmony Park — US "Comprar entradas" (TP06 TDD)

Implementación de la User Story **Comprar entradas** con TDD (Red → Green → Refactor).
Decisiones de diseño y bitácora de ciclos: [`../IS_DOC_TP06_DecisionesDeDiseno.md`](../IS_DOC_TP06_DecisionesDeDiseno.md).

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

## 3. Probar desde un celular en la misma red

No hace falta exportar ni instalar la aplicación en el celular: es una web y se abre desde el navegador. La PC y el celular deben estar conectados a la misma red local; por ejemplo, la PC por Ethernet y el celular por Wi-Fi, siempre que el router permita la comunicación entre ambos.

1. En la PC, ejecutá `ipconfig` y buscá la dirección IPv4 de la conexión Ethernet activa (por ejemplo, `192.168.100.107`). No uses `localhost` ni la dirección de un adaptador desconectado.
2. En `frontend/.env`, reemplazá `localhost` por esa IPv4:

   ```env
   VITE_API_URL=http://192.168.100.107:4000
   ```

3. En `backend/.env`, configurá la dirección del frontend con la misma IPv4:

   ```env
   FRONTEND_URL=http://192.168.100.107:5173
   ```

   Esta URL se utiliza para volver a la aplicación después del checkout de Mercado Pago. Conservá el resto de las variables y secretos de cada archivo `.env`.
4. Iniciá o reiniciá el backend (`npm run dev` desde `backend`) y el frontend escuchando en la red local (`npm run dev -- --host 0.0.0.0` desde `frontend`). Vite debe mostrar una dirección de red; el frontend utiliza el puerto `5173` y la API el `4000`.
5. Desde el navegador del celular, abrí `http://192.168.100.107:5173`, reemplazando la dirección de ejemplo por la IPv4 de la PC.

Si el celular no puede conectarse, comprobá que ambos dispositivos estén en la misma red, que la red Wi-Fi no tenga aislamiento de clientes y que el Firewall de Windows permita conexiones privadas a Node.js o a los puertos `5173` y `4000`.

**Mercado Pago:** esta configuración sirve para probar la app y abrir el checkout desde el celular, pero la dirección `192.168.x.x` solo es accesible dentro de la red local. Mercado Pago no puede acceder a ella desde Internet para regresar automáticamente a la app. Para probar el retorno desde el checkout se necesita exponer el frontend mediante una URL pública HTTPS y configurar esa URL en `FRONTEND_URL`. Además, los navegadores móviles pueden abrir Mercado Pago en una pestaña o bloquear la apertura inicial; si ocurre, usá el botón **Abrir Mercado Pago** de la pantalla de espera.

## API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/login` | — | `{ email, password }` → `{ token, usuario }` |
| GET | `/compras/fechas-disponibles` | — | Fechas que se pueden elegir en el calendario (`AAAA-MM-DD`) |
| POST | `/compras` | Bearer | `{ fechaVisita: "AAAA-MM-DD", cantidadEntradas, visitantes: [{ edad, tipoPase: "VIP"\|"REGULAR" }], formaPago: "EFECTIVO"\|"TARJETA" }` → `201` con mensaje, cantidad, fecha, monto, código de reserva y `urlPago` (si es tarjeta) |
| POST | `/compras/:codigoReserva/confirmar-pago` | Bearer | `{ idPago }` → confirma el pago con Mercado Pago y envía el mail |

Errores: `400 { mensaje }` si no se cumple un criterio de aceptación, `401` sin sesión, `500` ante fallas inesperadas.
