import { calcularMontoTotal, comprarEntradas } from '../src/services/compraService';
import { SolicitudCompra } from '../src/models/compra';

// Fecha actual fija para que los tests no dependan del día en que se corren: lunes 12/10/2026
const FECHA_ACTUAL = new Date(2026, 9, 12);

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

const crearDependencias = () => ({ fechaActual: FECHA_ACTUAL });

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
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-11' }); // domingo, ayer

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('La fecha de visita debe ser hoy o una fecha futura');
    });

    test('comprar para el día actual (valor límite) es válido', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-12' }); // lunes, hoy

      const resultado = await comprarEntradas(solicitud, crearDependencias());

      expect(resultado.fechaVisita).toBe('2026-10-12');
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

    test('comprar para una fecha inexistente (31 de febrero) falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2027-02-31' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
    });
  });

  describe('días de apertura del parque', () => {
    test('comprar para un martes (parque cerrado) falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-13' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('El parque está cerrado ese día. Abre todos los días excepto martes y jueves');
    });

    test('comprar para un jueves (parque cerrado) falla', async () => {
      const solicitud = crearSolicitudValida({ fechaVisita: '2026-10-15' });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('El parque está cerrado ese día. Abre todos los días excepto martes y jueves');
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

  describe('datos de cada visitante', () => {
    test('comprar sin indicar los datos de todos los visitantes falla', async () => {
      const solicitud = crearSolicitudValida({
        cantidadEntradas: 3,
        visitantes: [{ edad: 30, tipoPase: 'REGULAR' }, { edad: 8, tipoPase: 'VIP' }],
      });

      await expect(comprarEntradas(solicitud, crearDependencias()))
        .rejects.toThrow('Debe indicar la edad y el tipo de pase de cada uno de los 3 visitantes');
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

  test('la compra informa el monto total a pagar', async () => {
    // REGULAR adulto ($6.000) + VIP de 8 años con 50% ($5.000)
    const resultado = await comprarEntradas(crearSolicitudValida(), crearDependencias());

    expect(resultado.montoTotal).toBe(11000);
  });
});

describe('calcularMontoTotal', () => {
  test.each([
    ['REGULAR adulto', [{ edad: 30, tipoPase: 'REGULAR' }], 6000],
    ['VIP adulto', [{ edad: 30, tipoPase: 'VIP' }], 10000],
    ['REGULAR menor de 12 paga la mitad', [{ edad: 11, tipoPase: 'REGULAR' }], 3000],
    ['REGULAR de 12 años (valor límite) paga completo', [{ edad: 12, tipoPase: 'REGULAR' }], 6000],
    ['VIP jubilado paga la mitad', [{ edad: 70, tipoPase: 'VIP', esJubilado: true }], 5000],
    ['varios visitantes suman sus precios', [
      { edad: 40, tipoPase: 'VIP' },
      { edad: 38, tipoPase: 'REGULAR' },
      { edad: 5, tipoPase: 'REGULAR' },
    ], 19000],
  ])('%s', (_descripcion, visitantes, montoEsperado) => {
    expect(calcularMontoTotal(visitantes)).toBe(montoEsperado);
  });
});
