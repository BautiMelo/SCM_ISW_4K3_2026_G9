import nodemailer from 'nodemailer';
import { EnviadorMail } from '../models/compra';

export const crearEnviadorMailGmail = (usuario: string, contrasenaAplicacion: string): EnviadorMail => {
  const usuarioNormalizado = usuario.trim();
  const contrasenaNormalizada = contrasenaAplicacion.replace(/\s+/g, '');
  const transporte = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: usuarioNormalizado, pass: contrasenaNormalizada },
  });

  return {
    enviar: async (mail) => {
      await transporte.sendMail({
        from: `"EcoHarmony Park" <${usuarioNormalizado}>`,
        to: mail.destinatario,
        subject: mail.asunto,
        html: mail.cuerpo,
      });
    },
  };
};

// Alternativa para desarrollo cuando todavía no se configuró Gmail en el .env
export const crearEnviadorMailConsola = (): EnviadorMail => ({
  enviar: async (mail) => {
    console.log(`\n[MAIL SIMULADO] Para: ${mail.destinatario} | Asunto: ${mail.asunto}\n${mail.cuerpo}\n`);
  },
});
