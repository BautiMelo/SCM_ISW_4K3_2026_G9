import { DependenciasCompra, ResultadoCompra, SolicitudCompra } from '../models/compra';

export const comprarEntradas = async (
  solicitud: SolicitudCompra,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  if (solicitud.formaPago !== 'EFECTIVO' && solicitud.formaPago !== 'TARJETA') {
    throw new Error('Debe seleccionar la forma de pago: efectivo o tarjeta');
  }

  const [anio, mes, dia] = solicitud.fechaVisita.split('-');
  const diaSemana = new Date(Number(anio), Number(mes) - 1, Number(dia)).getDay();
  if (diaSemana === 2 || diaSemana === 4) {
    throw new Error('El parque está cerrado ese día. Abre todos los días excepto martes y jueves');
  }

  return {
    mensaje: `Compra realizada con éxito: ${solicitud.cantidadEntradas} entradas para el ${dia}/${mes}/${anio}`,
    cantidadEntradas: solicitud.cantidadEntradas,
    fechaVisita: solicitud.fechaVisita,
  };
};
