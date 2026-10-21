import {
  ClientesMercadoPago, armarPreferencia, crearPasarelaConClientes, crearPasarelaMercadoPago,
} from '../src/integraciones/mercadoPago';

const DATOS_PAGO = {
  codigoReserva: 'ABC12345',
  montoTotal: 20000,
  descripcion: '2 entradas EcoHarmony Park para el 14/10/2026',
};
const URL_LOCAL = 'http://localhost:5173';
const URL_CHECKOUT = 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123';

// Dobles de los clientes del SDK: se verifica qué se le pide a Mercado Pago sin llamarlo de verdad
const crearClientesDobles = () => {
  const clientes = {
    preferencias: { create: jest.fn().mockResolvedValue({ init_point: URL_CHECKOUT }) },
    pagos: { get: jest.fn(), search: jest.fn() },
  };
  return { clientes, pasarela: crearPasarelaConClientes(() => clientes as unknown as ClientesMercadoPago, URL_LOCAL) };
};

describe('armarPreferencia (pedido de Checkout Pro, sin red)', () => {
  test('arma un ítem por el total de la compra, en pesos', () => {
    const preferencia = armarPreferencia(DATOS_PAGO, URL_LOCAL);

    expect(preferencia.items).toEqual([{
      id: 'ABC12345',
      title: '2 entradas EcoHarmony Park para el 14/10/2026',
      quantity: 1,
      unit_price: 20000,
      currency_id: 'ARS',
    }]);
  });

  test('usa el código de reserva como external_reference y vuelve a /resultado', () => {
    const preferencia = armarPreferencia(DATOS_PAGO, URL_LOCAL);

    expect(preferencia.external_reference).toBe('ABC12345');
    expect(preferencia.back_urls).toEqual({
      success: 'http://localhost:5173/resultado',
      failure: 'http://localhost:5173/resultado',
      pending: 'http://localhost:5173/resultado',
    });
  });

  test('con una URL http (localhost) no pide auto_return, que Mercado Pago rechaza', () => {
    expect(armarPreferencia(DATOS_PAGO, URL_LOCAL)).not.toHaveProperty('auto_return');
  });

  test('con una URL https pública pide auto_return para los pagos aprobados', () => {
    expect(armarPreferencia(DATOS_PAGO, 'https://ecoharmony.example').auto_return).toBe('approved');
  });
});

describe('PasarelaMercadoPago con clientes del SDK dobles', () => {
  test('crearPago envía la preferencia armada y devuelve la URL de pago', async () => {
    const { clientes, pasarela } = crearClientesDobles();

    const url = await pasarela.crearPago(DATOS_PAGO);

    expect(url).toBe(URL_CHECKOUT);
    expect(clientes.preferencias.create).toHaveBeenCalledTimes(1);
    expect(clientes.preferencias.create).toHaveBeenCalledWith({ body: armarPreferencia(DATOS_PAGO, URL_LOCAL) });
  });

  test('crearPago falla si Mercado Pago no devuelve la URL de pago', async () => {
    const { clientes, pasarela } = crearClientesDobles();
    clientes.preferencias.create.mockResolvedValue({});

    await expect(pasarela.crearPago(DATOS_PAGO)).rejects.toThrow('Mercado Pago no devolvió la URL de pago');
  });

  test('crearPago falla si Mercado Pago responde con error', async () => {
    const { clientes, pasarela } = crearClientesDobles();
    clientes.preferencias.create.mockRejectedValue(new Error('invalid access token'));

    await expect(pasarela.crearPago(DATOS_PAGO)).rejects.toThrow('invalid access token');
  });

  test('consultarPago devuelve el estado y la referencia del pago', async () => {
    const { clientes, pasarela } = crearClientesDobles();
    clientes.pagos.get.mockResolvedValue({ status: 'approved', external_reference: 'ABC12345' });

    const pago = await pasarela.consultarPago('987654321');

    expect(clientes.pagos.get).toHaveBeenCalledWith({ id: '987654321' });
    expect(pago).toEqual({ estado: 'approved', codigoReserva: 'ABC12345' });
  });

  test('buscarPagoPorReserva pide el pago más nuevo con esa referencia', async () => {
    const { clientes, pasarela } = crearClientesDobles();
    clientes.pagos.search.mockResolvedValue({ results: [{ status: 'rejected', external_reference: 'ABC12345' }] });

    const pago = await pasarela.buscarPagoPorReserva('ABC12345');

    expect(clientes.pagos.search).toHaveBeenCalledWith({
      options: { external_reference: 'ABC12345', sort: 'date_created', criteria: 'desc' },
    });
    expect(pago).toEqual({ estado: 'rejected', codigoReserva: 'ABC12345' });
  });

  test('buscarPagoPorReserva falla si todavía no hay ningún pago', async () => {
    const { clientes, pasarela } = crearClientesDobles();
    clientes.pagos.search.mockResolvedValue({ results: [] });

    await expect(pasarela.buscarPagoPorReserva('ABC12345'))
      .rejects.toThrow('Todavía no hay un pago de Mercado Pago para el código ABC12345');
  });
});

describe('crearPasarelaMercadoPago', () => {
  test('sin MP_ACCESS_TOKEN el pago con tarjeta no está disponible', async () => {
    const pasarela = crearPasarelaMercadoPago('', URL_LOCAL);

    await expect(pasarela.crearPago(DATOS_PAGO)).rejects.toThrow('Falta MP_ACCESS_TOKEN');
  });
});
