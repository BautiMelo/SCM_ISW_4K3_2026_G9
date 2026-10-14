import request from 'supertest';
import { crearApp } from '../src/app';
import { crearRepositorioComprasEnMemoria } from '../src/data/repositorioCompras';

const JWT_SECRET = 'secreto-de-test';
const USUARIOS = [{ id: 1, nombre: 'Ana', email: 'ana@mail.com', password: 'ana123' }];

const crearAppDePrueba = () => {
  const dependencias = {
    fechaActual: new Date(2026, 9, 12), // lunes 12/10/2026
    enviadorMail: { enviar: jest.fn().mockResolvedValue(undefined) },
    pasarelaPago: { crearPago: jest.fn(), consultarPago: jest.fn() },
    repositorioCompras: crearRepositorioComprasEnMemoria(),
  };
  const app = crearApp({ jwtSecret: JWT_SECRET, usuarios: USUARIOS, crearDependencias: () => dependencias });
  return { app, dependencias };
};

const iniciarSesion = async (app: ReturnType<typeof crearApp>) => {
  const respuesta = await request(app).post('/auth/login').send({ email: 'ana@mail.com', password: 'ana123' });
  return respuesta.body.token as string;
};

const COMPRA_VALIDA = {
  fechaVisita: '2026-10-14', // miércoles
  cantidadEntradas: 1,
  visitantes: [{ edad: 30, tipoPase: 'REGULAR' }],
  formaPago: 'EFECTIVO',
};

describe('API /compras', () => {
  test('comprar sin haber iniciado sesión responde 401', async () => {
    const { app } = crearAppDePrueba();

    const respuesta = await request(app).post('/compras').send(COMPRA_VALIDA);

    expect(respuesta.status).toBe(401);
    expect(respuesta.body.mensaje).toBe('Debe iniciar sesión con un usuario registrado para comprar entradas');
  });

  test('iniciar sesión con credenciales incorrectas responde 401', async () => {
    const { app } = crearAppDePrueba();

    const respuesta = await request(app).post('/auth/login').send({ email: 'ana@mail.com', password: 'mal' });

    expect(respuesta.status).toBe(401);
  });

  test('un usuario registrado compra y recibe 201 con la cantidad y la fecha', async () => {
    const { app } = crearAppDePrueba();
    const token = await iniciarSesion(app);

    const respuesta = await request(app).post('/compras').set('Authorization', `Bearer ${token}`).send(COMPRA_VALIDA);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.mensaje).toBe('Compra realizada con éxito: 1 entradas para el 14/10/2026');
  });

  test('una compra que no cumple un criterio de aceptación responde 400 con el motivo', async () => {
    const { app } = crearAppDePrueba();
    const token = await iniciarSesion(app);

    const respuesta = await request(app)
      .post('/compras')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...COMPRA_VALIDA, cantidadEntradas: 11 });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toBe('La cantidad de entradas debe ser un número entero entre 1 y 10');
  });

  test('confirmar el pago aprobado de una compra con tarjeta responde 200', async () => {
    const { app, dependencias } = crearAppDePrueba();
    const token = await iniciarSesion(app);
    dependencias.pasarelaPago.crearPago.mockResolvedValue('https://mercadopago.test/pagar');
    const compra = await request(app)
      .post('/compras')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...COMPRA_VALIDA, formaPago: 'TARJETA' });
    dependencias.pasarelaPago.consultarPago.mockResolvedValue({
      estado: 'approved',
      codigoReserva: compra.body.codigoReserva,
    });

    const respuesta = await request(app)
      .post(`/compras/${compra.body.codigoReserva}/confirmar-pago`)
      .set('Authorization', `Bearer ${token}`)
      .send({ idPago: '123' });

    expect(compra.body.urlPago).toBe('https://mercadopago.test/pagar');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.cantidadEntradas).toBe(1);
  });
});
