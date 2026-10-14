import { DependenciasCompra, ResultadoCompra, SolicitudCompra } from '../models/compra';

const FORMAS_PAGO = ['EFECTIVO', 'TARJETA'];
// getDay(): 0 = domingo, 1 = lunes, 2 = martes, ..., 4 = jueves
const DIAS_CERRADOS = [2, 4];

// Convierte 'AAAA-MM-DD' a Date en hora local (new Date('AAAA-MM-DD') la tomaría en UTC y podría correrse un día)
const parsearFecha = (fecha: string): Date => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
};

const formatearFecha = (fecha: Date): string => fecha.toLocaleDateString('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const validarFormaPago = (formaPago?: string): void => {
  if (!formaPago || !FORMAS_PAGO.includes(formaPago)) {
    throw new Error('Debe seleccionar la forma de pago: efectivo o tarjeta');
  }
};

export const validarDiaApertura = (fechaVisita: Date): void => {
  if (DIAS_CERRADOS.includes(fechaVisita.getDay())) {
    throw new Error('El parque está cerrado ese día. Abre todos los días excepto martes y jueves');
  }
};

export const comprarEntradas = async (
  solicitud: SolicitudCompra,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  const fechaVisita = parsearFecha(solicitud.fechaVisita);

  validarFormaPago(solicitud.formaPago);
  validarDiaApertura(fechaVisita);

  return {
    mensaje: `Compra realizada con éxito: ${solicitud.cantidadEntradas} entradas para el ${formatearFecha(fechaVisita)}`,
    cantidadEntradas: solicitud.cantidadEntradas,
    fechaVisita: solicitud.fechaVisita,
  };
};
