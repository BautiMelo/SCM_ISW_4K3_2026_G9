import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioRegistrado } from '../models/compra';

// Solo deja pasar a usuarios registrados con sesión iniciada (token JWT válido)
export const crearMiddlewareAutenticar = (jwtSecret: string, usuarios: UsuarioRegistrado[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const [, token] = (req.headers.authorization ?? '').split(' ');

    try {
      const { id } = jwt.verify(token ?? '', jwtSecret) as { id: number };
      const usuario = usuarios.find((u) => u.id === id);
      if (!usuario) {
        throw new Error('Usuario inexistente');
      }
      res.locals.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
      next();
    } catch {
      res.status(401).json({ mensaje: 'Debe iniciar sesión con un usuario registrado para comprar entradas' });
    }
  };
