import { Request, Response } from 'express';
import { DependenciasCompra } from '../models/compra';
import { comprarEntradas, confirmarPago, obtenerFechasDisponibles } from '../services/compraService';

// El controller solo traduce HTTP <-> servicio. Las reglas de negocio están en compraService.
export const crearCompraController = (crearDependencias: () => DependenciasCompra) => ({
  fechasDisponibles: (_req: Request, res: Response): void => {
    res.json({ fechas: obtenerFechasDisponibles(crearDependencias().fechaActual) });
  },

  comprar: async (req: Request, res: Response): Promise<void> => {
    const { fechaVisita, cantidadEntradas, visitantes, formaPago } = req.body ?? {};
    const resultado = await comprarEntradas(
      { usuario: res.locals.usuario, fechaVisita, cantidadEntradas, visitantes, formaPago },
      crearDependencias(),
    );
    res.status(201).json(resultado);
  },

  confirmarPago: async (req: Request, res: Response): Promise<void> => {
    const resultado = await confirmarPago(String(req.params.codigoReserva), String(req.body?.idPago ?? ''), crearDependencias());
    res.json(resultado);
  },
});
