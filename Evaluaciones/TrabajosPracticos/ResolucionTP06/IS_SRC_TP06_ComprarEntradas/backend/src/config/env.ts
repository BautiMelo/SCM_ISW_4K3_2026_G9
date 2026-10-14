import dotenv from 'dotenv';

// Todos los secretos se leen del archivo .env (no versionado). Plantilla: .env.example
dotenv.config({ quiet: true });

const requerida = (nombre: string): string => {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(`Falta la variable ${nombre} en el archivo .env (copiá .env.example como .env y completala)`);
  }
  return valor;
};

export const config = {
  puerto: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  jwtSecret: requerida('JWT_SECRET'),
  // Opcionales para poder levantar la app mientras se consiguen las credenciales:
  // sin Mercado Pago solo funciona el pago en efectivo; sin Gmail los mails se muestran por consola.
  mpAccessToken: process.env.MP_ACCESS_TOKEN ?? '',
  mailUser: process.env.MAIL_USER ?? '',
  mailAppPassword: process.env.MAIL_APP_PASSWORD ?? '',
  usuarioDemoEmail: process.env.USUARIO_DEMO_EMAIL ?? '',
};
