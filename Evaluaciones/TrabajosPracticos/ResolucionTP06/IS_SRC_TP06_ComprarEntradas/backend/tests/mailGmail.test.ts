import {
  TransporteMail, crearEnviadorMailConTransporte, crearEnviadorMailConsola, normalizarCredencialesGmail,
} from '../src/integraciones/mailGmail';

const MAIL = {
  destinatario: 'ana@mail.com',
  asunto: 'EcoHarmony Park - Confirmación de tu reserva',
  cuerpo: '<h2>¡Gracias por tu reserva, Ana!</h2>',
};

// Doble del transporter de nodemailer: se verifica qué se envía sin mandar mails de verdad
const crearTransporteDoble = () => ({ sendMail: jest.fn().mockResolvedValue({ messageId: '1' }) });

describe('normalizarCredencialesGmail', () => {
  test('quita los espacios de la contraseña de aplicación y alrededor del usuario', () => {
    // Google muestra la contraseña de aplicación en grupos de 4 separados por espacios
    expect(normalizarCredencialesGmail('  parque@gmail.com ', 'abcd efgh ijkl mnop')).toEqual({
      usuario: 'parque@gmail.com',
      contrasena: 'abcdefghijklmnop',
    });
  });
});

describe('EnviadorMail con un transporter doble', () => {
  test('envía un solo mail con el remitente del parque, el destinatario, el asunto y el cuerpo', async () => {
    const transporte = crearTransporteDoble();

    await crearEnviadorMailConTransporte(transporte as unknown as TransporteMail, 'parque@gmail.com').enviar(MAIL);

    expect(transporte.sendMail).toHaveBeenCalledTimes(1);
    expect(transporte.sendMail).toHaveBeenCalledWith({
      from: '"EcoHarmony Park" <parque@gmail.com>',
      to: 'ana@mail.com',
      subject: 'EcoHarmony Park - Confirmación de tu reserva',
      html: '<h2>¡Gracias por tu reserva, Ana!</h2>',
    });
  });

  test('si el servidor de correo falla, el envío falla (comprarEntradas lo informa como mailEnviado false)', async () => {
    const transporte = crearTransporteDoble();
    transporte.sendMail.mockRejectedValue(new Error('Invalid login'));

    await expect(crearEnviadorMailConTransporte(transporte as unknown as TransporteMail, 'parque@gmail.com').enviar(MAIL))
      .rejects.toThrow('Invalid login');
  });
});

describe('crearEnviadorMailConsola (desarrollo sin Gmail configurado)', () => {
  test('muestra el destinatario y el asunto por consola en lugar de enviar', async () => {
    const consola = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    await crearEnviadorMailConsola().enviar(MAIL);

    expect(consola).toHaveBeenCalledWith(expect.stringContaining('Para: ana@mail.com | Asunto: EcoHarmony Park'));
    consola.mockRestore();
  });
});
