import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { CompraError } from './errors/compraError';
import { DependenciasCompra, UsuarioRegistrado } from './models/compra';
import { crearAuthRoute } from './routes/authRoute';
import { crearCompraRoute } from './routes/compraRoute';

export interface ConfiguracionApp {
  jwtSecret: string;
  usuarios: UsuarioRegistrado[];
  crearDependencias: () => DependenciasCompra;
}

// Se arma la app recibiendo sus dependencias: index.ts le pasa las reales y los tests le pasan dobles
export const crearApp = ({ jwtSecret, usuarios, crearDependencias }: ConfiguracionApp) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/auth', crearAuthRoute(jwtSecret, usuarios));
  app.use('/compras', crearCompraRoute(jwtSecret, usuarios, crearDependencias));

  // Errores de negocio -> 400 con el mensaje para el usuario. Cualquier otro -> 500 sin detalles internos.
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof CompraError) {
      res.status(400).json({ mensaje: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Ocurrió un error inesperado. Intentá nuevamente más tarde.' });
  });

  return app;
};
