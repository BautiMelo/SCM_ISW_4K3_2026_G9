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

export const validarFechaVisita = (fechaTexto: string, fechaActual: Date): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
    throw new Error('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
  }

  const fechaVisita = parsearFecha(fechaTexto);
  const hoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
  if (fechaVisita < hoy) {
    throw new Error('La fecha de visita debe ser hoy o una fecha futura');
  }

  return fechaVisita;
};

export const validarDiaApertura =(fechaVisita: Date): void => {
  if (DIAS_CERRADOS.includes(fechaVisita.getDay())) {
    throw new Error('El parque está cerrado ese día. Abre todos los días excepto martes y jueves');
  }
};

export const validarCantidadEntradas = (cantidadEntradas: number): void => {
  if (!Number.isInteger(cantidadEntradas) || cantidadEntradas < 1 || cantidadEntradas > 10) {
    throw new Error('La cantidad de entradas debe ser un número entero entre 1 y 10');
  }
};

export const comprarEntradas = async (
  solicitud: SolicitudCompra,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  validarFormaPago(solicitud.formaPago);
  const fechaVisita = validarFechaVisita(solicitud.fechaVisita, dependencias.fechaActual);
  validarDiaApertura(fechaVisita);
  validarCantidadEntradas(solicitud.cantidadEntradas);

  return {
    mensaje: `Compra realizada con éxito: ${solicitud.cantidadEntradas} entradas para el ${formatearFecha(fechaVisita)}`,
    cantidadEntradas: solicitud.cantidadEntradas,
    fechaVisita: solicitud.fechaVisita,
  };
};
