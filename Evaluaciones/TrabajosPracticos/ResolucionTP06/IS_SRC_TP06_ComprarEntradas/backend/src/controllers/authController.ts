import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioRegistrado } from '../models/compra';

export const crearAuthController = (jwtSecret: string, usuarios: UsuarioRegistrado[]) => ({
  login: (req: Request, res: Response): void => {
    const { email, password } = req.body ?? {};
    const usuario = usuarios.find((u) => u.email === email && u.password === password);

    if (!usuario) {
      res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
      return;
    }

    const token = jwt.sign({ id: usuario.id }, jwtSecret, { expiresIn: '2h' });
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  },
});
