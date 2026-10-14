import { comprarEntradas } from '../src/services/compraService';

// Fecha actual fija para que los tests no dependan del día en que se corren: lunes 12/10/2026
const FECHA_ACTUAL = new Date(2026, 9, 12);

describe('comprarEntradas', () => {
  test('compra exitosa en efectivo informa la cantidad de entradas y la fecha', async () => {
    const solicitud = {
      usuario: { id: 1, nombre: 'Ana', email: 'ana@mail.com' },
      fechaVisita: '2026-10-14', // miércoles
      cantidadEntradas: 2,
      visitantes: [
        { edad: 30, tipoPase: 'REGULAR' },
        { edad: 8, tipoPase: 'VIP' },
      ],
      formaPago: 'EFECTIVO',
    };

    const resultado = await comprarEntradas(solicitud, { fechaActual: FECHA_ACTUAL });

    expect(resultado.mensaje).toBe('Compra realizada con éxito: 2 entradas para el 14/10/2026');
    expect(resultado.cantidadEntradas).toBe(2);
    expect(resultado.fechaVisita).toBe('2026-10-14');
  });
});
