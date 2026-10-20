import { Router } from 'express';
import { DependenciasCompra, UsuarioRegistrado } from '../models/compra';
import { crearCompraController } from '../controllers/compraController';
import { crearMiddlewareAutenticar } from '../middleware/autenticar';

export const crearCompraRoute = (
  jwtSecret: string,
  usuarios: UsuarioRegistrado[],
  crearDependencias: () => DependenciasCompra,
): Router => {
  const router = Router();
  const autenticar = crearMiddlewareAutenticar(jwtSecret, usuarios);
  const compraController = crearCompraController(crearDependencias);

  router.get('/fechas-disponibles', compraController.fechasDisponibles);
  router.post('/', autenticar, compraController.comprar);
  router.post('/:codigoReserva/confirmar-pago', autenticar, compraController.confirmarPago);
  // Polling del frontend mientras se paga en Mercado Pago
  router.get('/:codigoReserva/estado', autenticar, compraController.estadoPago);

  return router;
};
