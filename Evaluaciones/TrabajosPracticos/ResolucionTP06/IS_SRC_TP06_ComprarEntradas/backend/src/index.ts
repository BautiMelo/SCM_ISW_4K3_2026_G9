import { crearApp } from './app';
import { config } from './config/env';
import { crearRepositorioComprasEnMemoria } from './data/repositorioCompras';
import { crearUsuarios } from './data/usuarios';
import { crearEnviadorMailConsola, crearEnviadorMailGmail } from './integraciones/mailGmail';
import { crearPasarelaMercadoPago } from './integraciones/mercadoPago';

const usuarios = crearUsuarios(config.usuarioDemoEmail);
const repositorioCompras = crearRepositorioComprasEnMemoria();
const pasarelaPago = crearPasarelaMercadoPago(config.mpAccessToken, config.frontendUrl);
const enviadorMail = config.mailUser && config.mailAppPassword
  ? crearEnviadorMailGmail(config.mailUser, config.mailAppPassword)
  : crearEnviadorMailConsola();

const app = crearApp({
  jwtSecret: config.jwtSecret,
  usuarios,
  // fechaActual se toma en cada request para validar contra el día real
  crearDependencias: () => ({ fechaActual: new Date(), enviadorMail, pasarelaPago, repositorioCompras }),
});

app.listen(config.puerto, () => {
  console.log(`API de EcoHarmony Park escuchando en http://localhost:${config.puerto}`);
  if (!config.mpAccessToken) console.warn('⚠ Sin MP_ACCESS_TOKEN: el pago con tarjeta no va a funcionar');
  if (!config.mailUser) console.warn('⚠ Sin MAIL_USER/MAIL_APP_PASSWORD: los mails se muestran por consola');
});
