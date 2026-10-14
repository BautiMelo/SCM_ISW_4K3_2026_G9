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

  router.post('/', autenticar, compraController.comprar);
  router.post('/:codigoReserva/confirmar-pago', autenticar, compraController.confirmarPago);

  return router;
};
