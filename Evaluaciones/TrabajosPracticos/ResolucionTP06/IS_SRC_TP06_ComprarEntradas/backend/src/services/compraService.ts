import { DependenciasCompra, ResultadoCompra, SolicitudCompra } from '../models/compra';

export const comprarEntradas = async (
  solicitud: SolicitudCompra,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  const [anio, mes, dia] = solicitud.fechaVisita.split('-');

  return {
    mensaje: `Compra realizada con éxito: ${solicitud.cantidadEntradas} entradas para el ${dia}/${mes}/${anio}`,
    cantidadEntradas: solicitud.cantidadEntradas,
    fechaVisita: solicitud.fechaVisita,
  };
};
