import { DependenciasCompra, ResultadoCompra, SolicitudCompra, Visitante } from '../models/compra';

const FORMAS_PAGO = ['EFECTIVO', 'TARJETA'];
const TIPOS_PASE = ['VIP', 'REGULAR'];
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
  const fechaVisita = parsearFecha(fechaTexto);
  // Si Date "corrigió" la fecha (ej. 31/02 -> 03/03), la fecha no existe
  const esFechaExistente = /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
    && fechaVisita.getDate() === Number(fechaTexto.split('-')[2]);
  if (!esFechaExistente) {
    throw new Error('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
  }

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

export const validarVisitantes = (visitantes: Visitante[], cantidadEntradas: number): void => {
  if (!Array.isArray(visitantes) || visitantes.length !== cantidadEntradas) {
    throw new Error(`Debe indicar la edad y el tipo de pase de cada uno de los ${cantidadEntradas} visitantes`);
  }

  for (const visitante of visitantes) {
    if (!Number.isInteger(visitante.edad) || visitante.edad! < 0 || visitante.edad! > 120) {
      throw new Error('La edad de cada visitante debe ser un número entero entre 0 y 120');
    }
    if (!visitante.tipoPase || !TIPOS_PASE.includes(visitante.tipoPase)) {
      throw new Error('El tipo de pase de cada visitante debe ser VIP o REGULAR');
    }
  }
};

export const comprarEntradas = async (
  solicitud: SolicitudCompra,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  if (!solicitud.usuario) {
    throw new Error('Solo los usuarios registrados pueden comprar entradas');
  }
  validarFormaPago(solicitud.formaPago);
  const fechaVisita = validarFechaVisita(solicitud.fechaVisita, dependencias.fechaActual);
  validarDiaApertura(fechaVisita);
  validarCantidadEntradas(solicitud.cantidadEntradas);
  validarVisitantes(solicitud.visitantes, solicitud.cantidadEntradas);

  return {
    mensaje: `Compra realizada con éxito: ${solicitud.cantidadEntradas} entradas para el ${formatearFecha(fechaVisita)}`,
    cantidadEntradas: solicitud.cantidadEntradas,
    fechaVisita: solicitud.fechaVisita,
  };
};
