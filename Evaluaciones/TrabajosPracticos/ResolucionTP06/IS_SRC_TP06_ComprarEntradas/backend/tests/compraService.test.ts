import {
  calcularMontoTotal, comprarEntradas, confirmarPago, consultarEstadoPago, obtenerFechasDisponibles, validarDiaApertura, validarFechaVisita,
} from '../src/services/compraService';
import { crearRepositorioComprasEnMemoria } from '../src/data/repositorioCompras';
import { EstadoCompra, SolicitudCompra, Visitante } from '../src/models/compra';

// Fecha y hora actual fijas para que los tests no dependan de cuándo se corren: martes 13/10/2026 10:00
const FECHA_ACTUAL = new Date(2026, 9, 13, 10, 0);

// Solicitud que cumple todos los criterios de aceptación. Cada test pisa solo el dato que quiere probar.
const crearSolicitudValida = (cambios: Partial<SolicitudCompra> = {}): SolicitudCompra => ({
  usuario: { id: 1, nombre: 'Ana', email: 'ana@mail.com' },
  fechaVisita: '2026-10-14', // miércoles
  cantidadEntradas: 2,
  visitantes: [
    { edad: 30, tipoPase: 'REGULAR' },
    { edad: 8, tipoPase: 'VIP' },
  ],
  formaPago: 'EFECTIVO',
  ...cambios,
});

const URL_PAGO_MP = 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123';

// Dobles de prueba: reemplazan al mail y a Mercado Pago reales para verificar qué se les pidió sin llamarlos
const crearDependencias = (fechaActual: Date = FECHA_ACTUAL) => ({
  fechaActual,
  enviadorMail: { enviar: jest.fn().mockResolvedValue(undefined) },
  pasarelaPago: {
    crearPago: jest.fn().mockResolvedValue(URL_PAGO_MP),
    consultarPago: jest.fn(),
    buscarPagoPorReserva: jest.fn(),
  },
  repositorioCompras: crearRepositorioComprasEnMemoria(),
});

describe('comprarEntradas', () => {
  test('compra exitosa en efectivo informa la cantidad de entradas y la fecha', async () => {
    const resultado = await comprarEntradas(crearSolicitudValida(), crearDependencias());

    expect(resultado.mensaje).toBe('Compra realizada con éxito: 2 entradas para el 14/10/2026');
    expect(resultado.cantidadEntradas).toBe(2);
    expect(resultado.fechaVisita).toBe('2026-10-14');
  });

  describe('usuario', () => {
    test('comprar sin ser un usuario registrado falla', async () => {
      const solicitud = crearSolicitudValida({ usuario: undefined });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Solo los usuarios registrados pueden comprar entradas');
    });
  });

  describe('forma de pago', () => {
    test('comprar sin seleccionar forma de pago falla', async () => {
      const solicitud = crearSolicitudValida({ formaPago: undefined });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe seleccionar la forma de pago: efectivo o tarjeta');
    });

    test('comprar con una forma de pago no contemplada falla', async () => {
      const solicitud = crearSolicitudValida({ formaPago: 'CHEQUE' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe seleccionar la forma de pago: efectivo o tarjeta');
    });
  });

  describe('fecha de visita', () => {
    test('comprar para una fecha pasada falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-11' }); // domingo, anteayer

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La fecha de visita debe ser hoy o una fecha futura');
    });

    test('comprar para el día actual (valor límite) es válido', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-13' }); // martes, hoy

      const resultado = await comprarEntradas(solicitud, crearDependencias());

      expect(resultado.fechaVisita).toBe('2026-10-13');
    });

    test('comprar sin indicar la fecha de visita falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
    });

    test('comprar con una fecha de visita con formato inválido falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '14/10/2026' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
    });

    // Tipo de dato: el frontend no lo permite, pero la API puede recibir cualquier JSON
    test.each([
      ['sin enviar', undefined],
      ['como número', 20261014],
      ['como objeto', { anio: 2026, mes: 10, dia: 14 }],
    ])('comprar con la fecha de visita %s (no es texto) falla', async (_caso, fechaVisita) => {
      const solicitud = crearSolicitudValida({ fechaVisita: fechaVisita as unknown as string });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
    });

    test('comprar para una fecha inexistente (31 de febrero) falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2027-02-31' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
    });

    test('comprar para hoy a las 17:30 (valor límite) es válido', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-13' });

      const resultado = await comprarEntradas(solicitud, crearDependencias(new Date(2026, 9, 13, 17, 30)));

      expect(resultado.fechaVisita).toBe('2026-10-13');
    });

    test('comprar para hoy después de las 17:30 falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-13' });

      await expect(comprarEntradas(solicitud, crearDependencias(new Date(2026, 9, 13, 17, 31))))
        .rejects.toThrow('Las entradas para hoy se pueden comprar hasta las 17:30 (el parque cierra a las 19:00)');
    });

    test('después de las 17:30 se puede comprar para mañana', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-14' });

      const resultado = await comprarEntradas(solicitud, crearDependencias(new Date(2026, 9, 13, 18, 0)));

      expect(resultado.fechaVisita).toBe('2026-10-14');
    });

    test('comprar para el mismo día del mes siguiente (valor límite) es válido', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-11-13' }); // viernes

      const resultado = await comprarEntradas(solicitud, crearDependencias());

      expect(resultado.fechaVisita).toBe('2026-11-13');
    });

    test('comprar con más de un mes de anticipación falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-11-14' }); // sábado

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Solo se pueden comprar entradas con hasta un mes de anticipación (hasta el 13/11/2026)');
    });

    test('desde el 31 de enero el límite es el último día de febrero', () => {
      const treintaYUnoDeEnero = new Date(2027, 0, 31, 10, 0);

      expect(() => validarFechaVisita('2027-02-28', treintaYUnoDeEnero)).not.toThrow();
      expect(() => validarFechaVisita('2027-03-01', treintaYUnoDeEnero))
        .toThrow('Solo se pueden comprar entradas con hasta un mes de anticipación (hasta el 28/02/2027)');
    });
  });

  describe('días de apertura del parque', () => {
    const MENSAJE_CERRADO = 'El parque está cerrado ese día. Abre todos los días excepto los lunes, el 25 de diciembre y el 1 de enero';

    test('comprar para un lunes (parque cerrado) falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-19' });

      await expect(comprarEntradas(solicitud, crearDependencias())).rejects.toThrow(MENSAJE_CERRADO);
    });

    test.each([
      ['martes', '2026-10-20'],
      ['jueves', '2026-10-15'],
      ['domingo', '2026-10-18'],
    ])('comprar para un %s (parque abierto) es válido', async (_dia, fechaVisita) => {
      const resultado = await comprarEntradas(crearSolicitudValida({ fechaVisita }), crearDependencias());

      expect(resultado.fechaVisita).toBe(fechaVisita);
    });

    // Feriados: se prueban con la función auxiliar porque quedan fuera del mes de anticipación permitido
    test('el 25 de diciembre el parque está cerrado', () => {
      expect(() => validarDiaApertura(new Date(2026, 11, 25))).toThrow(MENSAJE_CERRADO);
    });

    test('el 1 de enero el parque está cerrado', () => {
      expect(() => validarDiaApertura(new Date(2027, 0, 1))).toThrow(MENSAJE_CERRADO);
    });

    test('el 24 de diciembre (día anterior al feriado, un jueves) el parque está abierto', () => {
      expect(() => validarDiaApertura(new Date(2026, 11, 24))).not.toThrow();
    });
  });

  describe('cantidad de entradas', () => {
    const crearVisitantes = (cantidad: number) =>
      Array.from({ length: cantidad }, () => ({ edad: 25, tipoPase: 'REGULAR' }));

    test('comprar más de 10 entradas falla', async () => {
      const solicitud = crearSolicitudValida({ cantidadEntradas: 11, visitantes: crearVisitantes(11) });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La cantidad de entradas debe ser un número entero entre 1 y 10');
    });

    test('comprar exactamente 10 entradas (valor límite) es válido', async () => {
      const solicitud = crearSolicitudValida({ cantidadEntradas: 10, visitantes: crearVisitantes(10) });

      const resultado = await comprarEntradas(solicitud, crearDependencias());

      expect(resultado.cantidadEntradas).toBe(10);
    });

    test('comprar 0 entradas falla', async () => {
      const solicitud = crearSolicitudValida({ cantidadEntradas: 0, visitantes: [] });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La cantidad de entradas debe ser un número entero entre 1 y 10');
    });

    test('comprar una cantidad no entera de entradas falla', async () => {
      const solicitud = crearSolicitudValida({ cantidadEntradas: 2.5 });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La cantidad de entradas debe ser un número entero entre 1 y 10');
    });
  });

  describe('máximo de 10 entradas por usuario para una misma fecha', () => {
    const USUARIO_ANA = { id: 1, nombre: 'Ana', email: 'ana@mail.com' };
    const crearVisitantes = (cantidad: number) =>
      Array.from({ length: cantidad }, () => ({ edad: 25, tipoPase: 'REGULAR' }));

    // Deja registrada una compra anterior del usuario, como si la hubiera hecho en otra transacción
    const registrarCompraPrevia = async (
      dependencias: ReturnType<typeof crearDependencias>,
      { cantidad, estado, usuario = USUARIO_ANA, fechaVisita = '2026-10-14' }:
        { cantidad: number; estado: EstadoCompra; usuario?: typeof USUARIO_ANA; fechaVisita?: string },
    ) => {
      await dependencias.repositorioCompras.guardar({
        codigoReserva: `PREVIA${cantidad}${estado.charAt(0)}`,
        usuario,
        fechaVisita,
        cantidadEntradas: cantidad,
        visitantes: crearVisitantes(cantidad),
        formaPago: estado === 'RESERVADA' ? 'EFECTIVO' : 'TARJETA',
        montoTotal: cantidad * 10000,
        estado,
      });
    };

    const solicitarEntradas = (cantidad: number) =>
      crearSolicitudValida({ cantidadEntradas: cantidad, visitantes: crearVisitantes(cantidad) });

    test('con 8 entradas ya reservadas para esa fecha, comprar 3 más falla', async () => {
      const dependencias = crearDependencias();
      await registrarCompraPrevia(dependencias, { cantidad: 8, estado: 'RESERVADA' });

      await expect(comprarEntradas(solicitarEntradas(3), dependencias))
        .rejects.toThrow('Solo se pueden comprar 10 entradas por fecha. Ya tenés 8 para el 14/10/2026: podés comprar hasta 2 más');
    });

    test('con 8 entradas ya reservadas para esa fecha, comprar 2 más (valor límite) es válido', async () => {
      const dependencias = crearDependencias();
      await registrarCompraPrevia(dependencias, { cantidad: 8, estado: 'RESERVADA' });

      const resultado = await comprarEntradas(solicitarEntradas(2), dependencias);

      expect(resultado.cantidadEntradas).toBe(2);
    });

    test('las compras con tarjeta ya pagadas también suman', async () => {
      const dependencias = crearDependencias();
      await registrarCompraPrevia(dependencias, { cantidad: 6, estado: 'PAGADA' });

      await expect(comprarEntradas(solicitarEntradas(5), dependencias))
        .rejects.toThrow('Ya tenés 6 para el 14/10/2026: podés comprar hasta 4 más');
    });

    test('se suman varias compras anteriores', async () => {
      const dependencias = crearDependencias();
      await registrarCompraPrevia(dependencias, { cantidad: 4, estado: 'RESERVADA' });
      await registrarCompraPrevia(dependencias, { cantidad: 6, estado: 'PAGADA' });

      await expect(comprarEntradas(solicitarEntradas(1), dependencias))
        .rejects.toThrow('Ya tenés 10 para el 14/10/2026: podés comprar hasta 0 más');
    });

    test('las compras con tarjeta pendientes de pago no suman', async () => {
      const dependencias = crearDependencias();
      await registrarCompraPrevia(dependencias, { cantidad: 8, estado: 'PENDIENTE_PAGO' });

      const resultado = await comprarEntradas(solicitarEntradas(5), dependencias);

      expect(resultado.cantidadEntradas).toBe(5);
    });

    test('las compras para otra fecha no suman', async () => {
      const dependencias = crearDependencias();
      await registrarCompraPrevia(dependencias, { cantidad: 10, estado: 'RESERVADA', fechaVisita: '2026-10-15' });

      const resultado = await comprarEntradas(solicitarEntradas(10), dependencias);

      expect(resultado.cantidadEntradas).toBe(10);
    });

    test('las compras de otro usuario no suman', async () => {
      const dependencias = crearDependencias();
      const otroUsuario = { id: 2, nombre: 'Juan', email: 'juan@mail.com' };
      await registrarCompraPrevia(dependencias, { cantidad: 10, estado: 'RESERVADA', usuario: otroUsuario });

      const resultado = await comprarEntradas(solicitarEntradas(10), dependencias);

      expect(resultado.cantidadEntradas).toBe(10);
    });
  });

  describe('datos de cada visitante', () => {
    test('comprar sin indicar los datos de todos los visitantes falla', async () => {
      const solicitud = crearSolicitudValida({
        cantidadEntradas: 3,
        visitantes: [{ edad: 30, tipoPase: 'REGULAR' }, { edad: 8, tipoPase: 'VIP' }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar la edad y el tipo de pase de cada uno de los 3 visitantes');
    });

    test.each([
      ['vacío (null)', null],
      ['como texto', '30 REGULAR'],
    ])('comprar con un visitante %s falla', async (_caso, visitanteInvalido) => {
      const solicitud = crearSolicitudValida({
        visitantes: [{ edad: 30, tipoPase: 'REGULAR' }, visitanteInvalido as unknown as Visitante],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar la edad y el tipo de pase de cada uno de los 2 visitantes');
    });

    test('comprar con los visitantes como texto en lugar de una lista falla', async () => {
      const solicitud = crearSolicitudValida({ visitantes: '30,8' as unknown as Visitante[] });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar la edad y el tipo de pase de cada uno de los 2 visitantes');
    });

    test('comprar sin indicar la edad de un visitante falla', async () => {
      const solicitud = crearSolicitudValida({
        visitantes: [{ edad: 30, tipoPase: 'REGULAR' }, { tipoPase: 'VIP' }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La edad de cada visitante debe ser un número entero entre 0 y 120');
    });

    test('comprar con una edad negativa falla', async () => {
      const solicitud = crearSolicitudValida({
        visitantes: [{ edad: 30, tipoPase: 'REGULAR' }, { edad: -1, tipoPase: 'VIP' }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La edad de cada visitante debe ser un número entero entre 0 y 120');
    });

    test('comprar con una edad no entera falla', async () => {
      const solicitud = crearSolicitudValida({
        visitantes: [{ edad: 30.5, tipoPase: 'REGULAR' }, { edad: 8, tipoPase: 'VIP' }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La edad de cada visitante debe ser un número entero entre 0 y 120');
    });

    test('comprar sin indicar el tipo de pase de un visitante falla', async () => {
      const solicitud = crearSolicitudValida({
        visitantes: [{ edad: 30, tipoPase: 'REGULAR' }, { edad: 8 }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('El tipo de pase de cada visitante debe ser VIP o REGULAR');
    });

    test('comprar con un tipo de pase inexistente falla', async () => {
      const solicitud = crearSolicitudValida({
        visitantes: [{ edad: 30, tipoPase: 'PLATINO' }, { edad: 8, tipoPase: 'VIP' }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('El tipo de pase de cada visitante debe ser VIP o REGULAR');
    });
  });

  describe('pago con tarjeta (Mercado Pago)', () => {
    test('la compra con tarjeta crea el pago en Mercado Pago y devuelve la URL para redirigir', async () => {
      const dependencias = crearDependencias();

      const resultado = await comprarEntradas(crearSolicitudValida({ formaPago: 'TARJETA' }), dependencias);

      expect(resultado.urlPago).toBe(URL_PAGO_MP);
      expect(dependencias.pasarelaPago.crearPago).toHaveBeenCalledWith({
        codigoReserva: resultado.codigoReserva,
        montoTotal: 20000,
        descripcion: '2 entradas EcoHarmony Park para el 14/10/2026',
      });
    });

    test('la compra con tarjeta no envía el mail hasta que se apruebe el pago', async () => {
      const dependencias = crearDependencias();

      await comprarEntradas(crearSolicitudValida({ formaPago: 'TARJETA' }), dependencias);

      expect(dependencias.enviadorMail.enviar).not.toHaveBeenCalled();
    });

    test('si Mercado Pago falla, la compra no queda registrada ni se envía mail', async () => {
      const dependencias = crearDependencias();
      dependencias.pasarelaPago.crearPago.mockRejectedValue(new Error('Mercado Pago no responde'));

      await expect(comprarEntradas(crearSolicitudValida({ formaPago: 'TARJETA' }), dependencias))
        .rejects.toThrow('Mercado Pago no responde');

      expect(await dependencias.repositorioCompras.buscarPorUsuarioYFecha(1, '2026-10-14')).toEqual([]);
      expect(dependencias.enviadorMail.enviar).not.toHaveBeenCalled();
    });

    test('la compra en efectivo no crea un pago en Mercado Pago', async () => {
      const dependencias = crearDependencias();

      const resultado = await comprarEntradas(crearSolicitudValida({ formaPago: 'EFECTIVO' }), dependencias);

      expect(dependencias.pasarelaPago.crearPago).not.toHaveBeenCalled();
      expect(resultado.urlPago).toBeUndefined();
    });
  });

  describe('compra sin costo (todos los visitantes de hasta 3 años)', () => {
    const solicitarSinCosto = (formaPago: string) => crearSolicitudValida({
      formaPago,
      visitantes: [{ edad: 2, tipoPase: 'REGULAR' }, { edad: 3, tipoPase: 'VIP' }],
    });

    test('con tarjeta no crea un pago en Mercado Pago (no se cobra $0)', async () => {
      const dependencias = crearDependencias();

      const resultado = await comprarEntradas(solicitarSinCosto('TARJETA'), dependencias);

      expect(resultado.montoTotal).toBe(0);
      expect(resultado.urlPago).toBeUndefined();
      expect(dependencias.pasarelaPago.crearPago).not.toHaveBeenCalled();
    });

    test.each(['TARJETA', 'EFECTIVO'])('pagando con %s queda registrada como SIN_COSTO', async (formaPago) => {
      const dependencias = crearDependencias();

      const resultado = await comprarEntradas(solicitarSinCosto(formaPago), dependencias);

      const compra = await dependencias.repositorioCompras.buscarPorCodigo(resultado.codigoReserva);
      expect(compra?.estado).toBe('SIN_COSTO');
    });

    test('con tarjeta envía el mail de confirmación al instante, indicando que no tiene costo', async () => {
      const dependencias = crearDependencias();

      await comprarEntradas(solicitarSinCosto('TARJETA'), dependencias);

      expect(dependencias.enviadorMail.enviar).toHaveBeenCalledTimes(1);
      const mail = dependencias.enviadorMail.enviar.mock.calls[0][0];
      expect(mail.asunto).toBe('EcoHarmony Park - Confirmación de tu reserva');
      expect(mail.cuerpo).toContain('Esta compra no tiene costo');
    });

    test('suma al máximo de 10 entradas por fecha (los menores de 3 años también son entradas)', async () => {
      const dependencias = crearDependencias();
      await comprarEntradas(solicitarSinCosto('TARJETA'), dependencias);

      const nueveEntradas = crearSolicitudValida({
        cantidadEntradas: 9,
        visitantes: Array.from({ length: 9 }, () => ({ edad: 25, tipoPase: 'REGULAR' })),
      });

      await expect(comprarEntradas(nueveEntradas, dependencias))
        .rejects.toThrow('Ya tenés 2 para el 14/10/2026: podés comprar hasta 8 más');
    });
  });

  test('la compra en efectivo queda registrada como RESERVADA', async () => {
    const dependencias = crearDependencias();

    const resultado = await comprarEntradas(crearSolicitudValida(), dependencias);

    const compra = await dependencias.repositorioCompras.buscarPorCodigo(resultado.codigoReserva);
    expect(compra?.estado).toBe('RESERVADA');
  });

  test('la compra con tarjeta queda registrada como PENDIENTE_PAGO', async () => {
    const dependencias = crearDependencias();

    const resultado = await comprarEntradas(crearSolicitudValida({ formaPago: 'TARJETA' }), dependencias);

    const compra = await dependencias.repositorioCompras.buscarPorCodigo(resultado.codigoReserva);
    expect(compra?.estado).toBe('PENDIENTE_PAGO');
  });

  test('la compra informa el monto total a pagar', async () => {
    // REGULAR adulto ($10.000) + VIP de 8 años con 50% ($10.000)
    const resultado = await comprarEntradas(crearSolicitudValida(), crearDependencias());

    expect(resultado.montoTotal).toBe(20000);
  });

  describe('mail de confirmación', () => {
    test('la compra en efectivo envía un mail de confirmación al usuario', async () => {
      const dependencias = crearDependencias();

      const resultado = await comprarEntradas(crearSolicitudValida(), dependencias);

      expect(dependencias.enviadorMail.enviar).toHaveBeenCalledTimes(1);
      const mail = dependencias.enviadorMail.enviar.mock.calls[0][0];
      expect(mail.destinatario).toBe('ana@mail.com');
      expect(mail.asunto).toBe('EcoHarmony Park - Confirmación de tu reserva');
      expect(mail.cuerpo).toContain('2 entradas para el 14/10/2026');
      expect(mail.cuerpo).toContain('$20000');
      expect(mail.cuerpo).toContain(resultado.codigoReserva);
    });

    test('cuando el mail se envía, el resultado lo informa', async () => {
      const resultado = await comprarEntradas(crearSolicitudValida(), crearDependencias());

      expect(resultado.mailEnviado).toBe(true);
    });

    test('si falla el envío del mail, la compra igual queda RESERVADA e informa que el mail no se envió', async () => {
      const dependencias = crearDependencias();
      dependencias.enviadorMail.enviar.mockRejectedValue(new Error('Gmail no responde'));

      const resultado = await comprarEntradas(crearSolicitudValida(), dependencias);

      expect(resultado.mailEnviado).toBe(false);
      const compra = await dependencias.repositorioCompras.buscarPorCodigo(resultado.codigoReserva);
      expect(compra?.estado).toBe('RESERVADA');
    });

    test('la compra genera un código de reserva', async () => {
      const resultado = await comprarEntradas(crearSolicitudValida(), crearDependencias());

      expect(resultado.codigoReserva).toMatch(/^[A-Z0-9]{8}$/);
    });

    test('una compra inválida no envía mail', async () => {
      const dependencias = crearDependencias();

      await expect(comprarEntradas(crearSolicitudValida({ cantidadEntradas: 11 }), dependencias)).rejects.toThrow();

      expect(dependencias.enviadorMail.enviar).not.toHaveBeenCalled();
    });
  });
});

// Deja una compra con tarjeta pendiente de pago y configura qué responde Mercado Pago al consultar el pago.
// La usan los tests de confirmarPago y los de consultarEstadoPago
const prepararCompraConTarjeta = async (estadoPago: string, codigoDelPago?: string) => {
  const dependencias = crearDependencias();
  const { codigoReserva } = await comprarEntradas(crearSolicitudValida({ formaPago: 'TARJETA' }), dependencias);
  dependencias.pasarelaPago.consultarPago.mockResolvedValue({
    estado: estadoPago,
    codigoReserva: codigoDelPago ?? codigoReserva,
  });
  return { dependencias, codigoReserva };
};

describe('confirmarPago (vuelta de Mercado Pago)', () => {
  const ID_PAGO = '987654321';

  test('con el pago aprobado la compra queda PAGADA, informa cantidad y fecha y envía el mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('approved');

    const resultado = await confirmarPago(codigoReserva, ID_PAGO, dependencias);

    expect(resultado.mensaje).toBe('Compra realizada con éxito: 2 entradas para el 14/10/2026');
    expect(dependencias.pasarelaPago.consultarPago).toHaveBeenCalledWith(ID_PAGO);
    expect((await dependencias.repositorioCompras.buscarPorCodigo(codigoReserva))?.estado).toBe('PAGADA');
    expect(dependencias.enviadorMail.enviar).toHaveBeenCalledTimes(1);
    const mail = dependencias.enviadorMail.enviar.mock.calls[0][0];
    expect(mail.destinatario).toBe('ana@mail.com');
    expect(mail.asunto).toBe('EcoHarmony Park - Confirmación de tu compra');
    expect(mail.cuerpo).toContain(codigoReserva);
  });

  test('si falla el envío del mail, la compra igual queda PAGADA e informa que el mail no se envió', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('approved');
    dependencias.enviadorMail.enviar.mockRejectedValue(new Error('Gmail no responde'));

    const resultado = await confirmarPago(codigoReserva, ID_PAGO, dependencias);

    expect(resultado.mailEnviado).toBe(false);
    expect((await dependencias.repositorioCompras.buscarPorCodigo(codigoReserva))?.estado).toBe('PAGADA');
  });

  test('con el pago rechazado falla y no envía mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('rejected');

    await expect(confirmarPago(codigoReserva, ID_PAGO, dependencias))
      .rejects.toThrow('El pago no fue aprobado por Mercado Pago');
    expect(dependencias.enviadorMail.enviar).not.toHaveBeenCalled();
  });

  test('con un código de reserva inexistente falla', async () => {
    const dependencias = crearDependencias();

    await expect(confirmarPago('NOEXISTE', ID_PAGO, dependencias))
      .rejects.toThrow('No existe una compra con el código NOEXISTE');
  });

  test('con un pago que pertenece a otra compra falla', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('approved', 'OTRACOMP');

    await expect(confirmarPago(codigoReserva, ID_PAGO, dependencias))
      .rejects.toThrow('El pago no corresponde a esta compra');
  });

  test('confirmar dos veces el mismo pago envía un solo mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('approved');

    await confirmarPago(codigoReserva, ID_PAGO, dependencias);
    await confirmarPago(codigoReserva, ID_PAGO, dependencias);

    expect(dependencias.enviadorMail.enviar).toHaveBeenCalledTimes(1);
  });
});

describe('consultarEstadoPago (polling del frontend mientras se paga en Mercado Pago)', () => {
  // Simula lo que devuelve la búsqueda en Mercado Pago por external_reference
  const simularPagoEnMercadoPago = (
    dependencias: ReturnType<typeof crearDependencias>,
    estado: string,
    codigo: string,
  ) => dependencias.pasarelaPago.buscarPagoPorReserva.mockResolvedValue({ estado, codigoReserva: codigo });

  test('con el pago todavía sin aprobar responde PENDIENTE_PAGO y no envía mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('pending');
    simularPagoEnMercadoPago(dependencias, 'pending', codigoReserva);

    const respuesta = await consultarEstadoPago(codigoReserva, dependencias);

    expect(respuesta.estado).toBe('PENDIENTE_PAGO');
    expect(respuesta.pagoMercadoPago).toBe('pending');
    expect(dependencias.enviadorMail.enviar).not.toHaveBeenCalled();
    expect((await dependencias.repositorioCompras.buscarPorCodigo(codigoReserva))?.estado).toBe('PENDIENTE_PAGO');
  });

  test('sin ningún pago creado todavía responde PENDIENTE_PAGO sin estado de Mercado Pago', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('pending');
    dependencias.pasarelaPago.buscarPagoPorReserva.mockRejectedValue(new Error('no hay pagos'));

    const respuesta = await consultarEstadoPago(codigoReserva, dependencias);

    expect(respuesta.estado).toBe('PENDIENTE_PAGO');
    expect(respuesta.pagoMercadoPago).toBe('');
  });

  test('cuando Mercado Pago ya aprobó el pago queda PAGADA, informa el resultado y envía el mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('approved');
    simularPagoEnMercadoPago(dependencias, 'approved', codigoReserva);

    const respuesta = await consultarEstadoPago(codigoReserva, dependencias);

    expect(respuesta.estado).toBe('PAGADA');
    expect(respuesta.resultado?.mensaje).toBe('Compra realizada con éxito: 2 entradas para el 14/10/2026');
    expect(dependencias.enviadorMail.enviar).toHaveBeenCalledTimes(1);
    expect((await dependencias.repositorioCompras.buscarPorCodigo(codigoReserva))?.estado).toBe('PAGADA');
  });

  test('con el pago rechazado sigue PENDIENTE_PAGO (el usuario puede reintentar) y no envía mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('rejected');
    simularPagoEnMercadoPago(dependencias, 'rejected', codigoReserva);

    const respuesta = await consultarEstadoPago(codigoReserva, dependencias);

    expect(respuesta.estado).toBe('PENDIENTE_PAGO');
    expect(respuesta.pagoMercadoPago).toBe('rejected');
    expect(dependencias.enviadorMail.enviar).not.toHaveBeenCalled();
  });

  test('una compra ya PAGADA no vuelve a consultar Mercado Pago ni re-envía el mail', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('approved');
    simularPagoEnMercadoPago(dependencias, 'approved', codigoReserva);
    await consultarEstadoPago(codigoReserva, dependencias);

    await consultarEstadoPago(codigoReserva, dependencias);

    expect(dependencias.pasarelaPago.buscarPagoPorReserva).toHaveBeenCalledTimes(1);
    expect(dependencias.enviadorMail.enviar).toHaveBeenCalledTimes(1);
  });

  test('el último pago gana: un reintento después de un rechazo queda PAGADA', async () => {
    const { dependencias, codigoReserva } = await prepararCompraConTarjeta('rejected');
    // La búsqueda devuelve el pago más nuevo primero: 1er poll ve el rechazo, 2do el reintento aprobado
    dependencias.pasarelaPago.buscarPagoPorReserva
      .mockResolvedValueOnce({ estado: 'rejected', codigoReserva: codigoReserva })
      .mockResolvedValue({ estado: 'approved', codigoReserva: codigoReserva });
    await consultarEstadoPago(codigoReserva, dependencias); // primer intento rechazado

    const respuesta = await consultarEstadoPago(codigoReserva, dependencias);

    expect(respuesta.estado).toBe('PAGADA');
  });

  test('una compra en efectivo (RESERVADA) responde RESERVADA sin consultar Mercado Pago', async () => {
    const dependencias = crearDependencias();
    const resultado = await comprarEntradas(crearSolicitudValida(), dependencias);

    const respuesta = await consultarEstadoPago(resultado.codigoReserva, dependencias);

    expect(respuesta.estado).toBe('RESERVADA');
    expect(respuesta.resultado?.codigoReserva).toBe(resultado.codigoReserva);
    expect(dependencias.pasarelaPago.buscarPagoPorReserva).not.toHaveBeenCalled();
  });

  test('con un código de reserva inexistente falla', async () => {
    await expect(consultarEstadoPago('NOEXISTE', crearDependencias()))
      .rejects.toThrow('No existe una compra con el código NOEXISTE');
  });
});

describe('calcularMontoTotal', () => {
  // Precios y descuentos definidos por el PO: Común (REGULAR) $10.000, VIP $20.000.
  // <= 3 años no pagan; <= 15 años y >= 60 años pagan 50%.
  test.each([
    ['REGULAR adulto paga $10.000', [{ edad: 30, tipoPase: 'REGULAR' }], 10000],
    ['VIP adulto paga $20.000', [{ edad: 30, tipoPase: 'VIP' }], 20000],
    ['de 3 años (valor límite) no paga', [{ edad: 3, tipoPase: 'VIP' }], 0],
    ['de 4 años paga la mitad', [{ edad: 4, tipoPase: 'REGULAR' }], 5000],
    ['de 15 años (valor límite) paga la mitad', [{ edad: 15, tipoPase: 'REGULAR' }], 5000],
    ['de 16 años paga completo', [{ edad: 16, tipoPase: 'REGULAR' }], 10000],
    ['de 59 años paga completo', [{ edad: 59, tipoPase: 'VIP' }], 20000],
    ['de 60 años (valor límite) paga la mitad', [{ edad: 60, tipoPase: 'VIP' }], 10000],
    ['varios visitantes suman sus precios', [
      { edad: 40, tipoPase: 'VIP' },
      { edad: 38, tipoPase: 'REGULAR' },
      { edad: 2, tipoPase: 'REGULAR' },
    ], 30000],
  ])('%s', (_descripcion, visitantes, montoEsperado) => {
    expect(calcularMontoTotal(visitantes)).toBe(montoEsperado);
  });
});

describe('obtenerFechasDisponibles (días habilitados en el calendario)', () => {
  test('va desde hoy hasta el mismo día del mes siguiente', () => {
    const fechas = obtenerFechasDisponibles(FECHA_ACTUAL); // martes 13/10/2026 10:00

    expect(fechas[0]).toBe('2026-10-13');
    expect(fechas[fechas.length - 1]).toBe('2026-11-13');
  });

  test('no incluye los lunes', () => {
    const fechas = obtenerFechasDisponibles(FECHA_ACTUAL);

    expect(fechas).not.toContain('2026-10-19');
    expect(fechas).not.toContain('2026-11-09');
    expect(fechas).toHaveLength(28); // 32 días del 13/10 al 13/11 menos 4 lunes
  });

  test('después de las 17:30 no incluye el día de hoy', () => {
    const fechas = obtenerFechasDisponibles(new Date(2026, 9, 13, 17, 31));

    expect(fechas[0]).toBe('2026-10-14');
  });

  test('no incluye el 25 de diciembre ni el 1 de enero', () => {
    const fechas = obtenerFechasDisponibles(new Date(2026, 11, 20, 10, 0));

    expect(fechas).toContain('2026-12-24');
    expect(fechas).not.toContain('2026-12-25');
    expect(fechas).not.toContain('2027-01-01');
  });
});
