import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { DatosPago, PasarelaPago } from '../models/compra';

// Clientes del SDK que usa la pasarela. En los tests se reemplazan por dobles para no llamar a Mercado Pago.
export interface ClientesMercadoPago {
  preferencias: Pick<Preference, 'create'>;
  pagos: Pick<Payment, 'get' | 'search'>;
}

// Arma el pedido de Checkout Pro sin llamar a la red, así se testea sin dobles.
// Al terminar, Mercado Pago vuelve al frontend (/resultado) con payment_id, status y external_reference.
export const armarPreferencia = (datos: DatosPago, frontendUrl: string) => {
  const urlResultado = `${frontendUrl}/resultado`;
  return {
    items: [{
      id: datos.codigoReserva,
      title: datos.descripcion,
      quantity: 1,
      unit_price: datos.montoTotal,
      currency_id: 'ARS',
    }],
    external_reference: datos.codigoReserva,
    back_urls: { success: urlResultado, failure: urlResultado, pending: urlResultado },
    // Mercado Pago solo acepta auto_return con URLs https públicas. En localhost el usuario
    // vuelve con el botón "Volver al sitio" del checkout.
    ...(frontendUrl.startsWith('https://') ? { auto_return: 'approved' } : {}),
  };
};

// Checkout Pro: se crea una "preferencia" y se redirige al usuario a la URL de pago de Mercado Pago.
export const crearPasarelaConClientes = (
  obtenerClientes: () => ClientesMercadoPago,
  frontendUrl: string,
): PasarelaPago => ({
  crearPago: async (datos) => {
    const preferencia = await obtenerClientes().preferencias.create({ body: armarPreferencia(datos, frontendUrl) });
    if (!preferencia.init_point) {
      throw new Error('Mercado Pago no devolvió la URL de pago');
    }
    return preferencia.init_point;
  },

  consultarPago: async (idPago) => {
    const pago = await obtenerClientes().pagos.get({ id: idPago });
    return { estado: pago.status ?? '', codigoReserva: pago.external_reference ?? '' };
  },

  // El polling del frontend pregunta por el último pago asociado a la preferencia (external_reference):
  // si el usuario reintenta después de un rechazo, el pago nuevo con la misma referencia es el que vale
  buscarPagoPorReserva: async (codigoReserva) => {
    const busqueda = await obtenerClientes().pagos.search({
      options: { external_reference: codigoReserva, sort: 'date_created', criteria: 'desc' },
    });
    const pago = busqueda.results?.[0];
    if (!pago) {
      throw new Error(`Todavía no hay un pago de Mercado Pago para el código ${codigoReserva}`);
    }
    return { estado: pago.status ?? '', codigoReserva: pago.external_reference ?? '' };
  },
});

export const crearPasarelaMercadoPago = (accessToken: string, frontendUrl: string): PasarelaPago =>
  crearPasarelaConClientes(() => {
    if (!accessToken) {
      throw new Error('Falta MP_ACCESS_TOKEN en el .env: el pago con tarjeta no está disponible');
    }
    const cliente = new MercadoPagoConfig({ accessToken });
    return { preferencias: new Preference(cliente), pagos: new Payment(cliente) };
  }, frontendUrl);
