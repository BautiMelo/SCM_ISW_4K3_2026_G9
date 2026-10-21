import nodemailer, { Transporter } from 'nodemailer';
import { EnviadorMail } from '../models/compra';

// Parte del transporter de nodemailer que usa el enviador. En los tests se reemplaza por un doble.
export type TransporteMail = Pick<Transporter, 'sendMail'>;

// Google muestra la contraseña de aplicación en grupos de 4 separados por espacios: se aceptan tal cual se copian
export const normalizarCredencialesGmail = (usuario: string, contrasenaAplicacion: string) => ({
  usuario: usuario.trim(),
  contrasena: contrasenaAplicacion.replace(/\s+/g, ''),
});

export const crearEnviadorMailConTransporte = (transporte: TransporteMail, remitente: string): EnviadorMail => ({
  enviar: async (mail) => {
    await transporte.sendMail({
      from: `"EcoHarmony Park" <${remitente}>`,
      to: mail.destinatario,
      subject: mail.asunto,
      html: mail.cuerpo,
    });
  },
});

export const crearEnviadorMailGmail = (usuario: string, contrasenaAplicacion: string): EnviadorMail => {
  const credenciales = normalizarCredencialesGmail(usuario, contrasenaAplicacion);
  const transporte = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: credenciales.usuario, pass: credenciales.contrasena },
  });
  return crearEnviadorMailConTransporte(transporte, credenciales.usuario);
};

// Alternativa para desarrollo cuando todavía no se configuró Gmail en el .env
export const crearEnviadorMailConsola = (): EnviadorMail => ({
  enviar: async (mail) => {
    console.log(`\n[MAIL SIMULADO] Para: ${mail.destinatario} | Asunto: ${mail.asunto}\n${mail.cuerpo}\n`);
  },
});
