import { Router } from 'express';
import { UsuarioRegistrado } from '../models/compra';
import { crearAuthController } from '../controllers/authController';

export const crearAuthRoute = (jwtSecret: string, usuarios: UsuarioRegistrado[]): Router => {
  const router = Router();
  const authController = crearAuthController(jwtSecret, usuarios);

  router.post('/login', authController.login);

  return router;
};
