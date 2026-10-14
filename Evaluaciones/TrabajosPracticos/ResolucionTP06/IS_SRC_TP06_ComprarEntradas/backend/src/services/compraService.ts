import { randomUUID } from 'crypto';
import { CompraError } from '../errors/compraError';
import { DependenciasCompra, ResultadoCompra, SolicitudCompra, Usuario, Visitante } from '../models/compra';

const FORMAS_PAGO = ['EFECTIVO', 'TARJETA'];
const TIPOS_PASE = ['VIP', 'REGULAR'];
// getDay(): 0 = domingo, 1 = lunes, 2 = martes, ..., 4 = jueves
const DIAS_CERRADOS = [2, 4];
const CANTIDAD_MAXIMA_ENTRADAS = 10;
const EDAD_MAXIMA = 120;
const PRECIOS_PASE: Record<string, number> = { REGULAR: 6000, VIP: 10000 };
const EDAD_MINIMA_SIN_DESCUENTO = 12;

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

const esEnteroEntre = (valor: unknown, minimo: number, maximo: number): boolean =>
  Number.isInteger(valor) && (valor as number) >= minimo && (valor as number) <= maximo;

export const validarUsuario = (usuario?: Usuario): void => {
  if (!usuario) {
    throw new CompraError('Solo los usuarios registrados pueden comprar entradas');
  }
};

export const validarFormaPago = (formaPago?: string): void => {
  if (!formaPago || !FORMAS_PAGO.includes(formaPago)) {
    throw new CompraError('Debe seleccionar la forma de pago: efectivo o tarjeta');
  }
};

export const validarFechaVisita = (fechaTexto: string, fechaActual: Date): Date => {
  const fechaVisita = parsearFecha(fechaTexto);
  // Si Date "corrigió" la fecha (ej. 31/02 -> 03/03), la fecha no existe
  const esFechaExistente = /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
    && fechaVisita.getDate() === Number(fechaTexto.split('-')[2]);
  if (!esFechaExistente) {
    throw new CompraError('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
  }

  const hoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
  if (fechaVisita < hoy) {
    throw new CompraError('La fecha de visita debe ser hoy o una fecha futura');
  }

  return fechaVisita;
};

export const validarDiaApertura = (fechaVisita: Date): void => {
  if (DIAS_CERRADOS.includes(fechaVisita.getDay())) {
    throw new CompraError('El parque está cerrado ese día. Abre todos los días excepto martes y jueves');
  }
};

export const validarCantidadEntradas = (cantidadEntradas: number): void => {
  if (!esEnteroEntre(cantidadEntradas, 1, CANTIDAD_MAXIMA_ENTRADAS)) {
    throw new CompraError(`La cantidad de entradas debe ser un número entero entre 1 y ${CANTIDAD_MAXIMA_ENTRADAS}`);
  }
};

export const validarVisitantes = (visitantes: Visitante[], cantidadEntradas: number): void => {
  if (!Array.isArray(visitantes) || visitantes.length !== cantidadEntradas) {
    throw new CompraError(`Debe indicar la edad y el tipo de pase de cada uno de los ${cantidadEntradas} visitantes`);
  }

  for (const visitante of visitantes) {
    if (!esEnteroEntre(visitante.edad, 0, EDAD_MAXIMA)) {
      throw new CompraError(`La edad de cada visitante debe ser un número entero entre 0 y ${EDAD_MAXIMA}`);
    }
    if (!visitante.tipoPase || !TIPOS_PASE.includes(visitante.tipoPase)) {
      throw new CompraError('El tipo de pase de cada visitante debe ser VIP o REGULAR');
    }
  }
};

// Menores de 12 años y jubilados pagan la mitad del precio del pase
export const calcularMontoTotal = (visitantes: Visitante[]): number =>
  visitantes.reduce((total, visitante) => {
    const precioPase = PRECIOS_PASE[visitante.tipoPase!];
    const tieneDescuento = visitante.esJubilado || visitante.edad! < EDAD_MINIMA_SIN_DESCUENTO;
    return total + (tieneDescuento ? precioPase / 2 : precioPase);
  }, 0);

export const comprarEntradas = async (
  solicitud: SolicitudCompra,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  validarUsuario(solicitud.usuario);
  validarFormaPago(solicitud.formaPago);
  const fechaVisita = validarFechaVisita(solicitud.fechaVisita, dependencias.fechaActual);
  validarDiaApertura(fechaVisita);
  validarCantidadEntradas(solicitud.cantidadEntradas);
  validarVisitantes(solicitud.visitantes, solicitud.cantidadEntradas);

  const montoTotal = calcularMontoTotal(solicitud.visitantes);
  const codigoReserva = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  const detalle = `${solicitud.cantidadEntradas} entradas para el ${formatearFecha(fechaVisita)}`;

  await dependencias.enviadorMail.enviar({
    destinatario: solicitud.usuario!.email,
    asunto: 'EcoHarmony Park - Confirmación de tu reserva',
    cuerpo: `
      <h2>¡Gracias por tu reserva, ${solicitud.usuario!.nombre}!</h2>
      <p>Reservaste <strong>${detalle}</strong>.</p>
      <p>Total a pagar en boletería: <strong>$${montoTotal}</strong></p>
      <p>Código de reserva: <strong>${codigoReserva}</strong></p>`,
  });

  return {
    mensaje: `Compra realizada con éxito: ${detalle}`,
    cantidadEntradas: solicitud.cantidadEntradas,
    fechaVisita: solicitud.fechaVisita,
    montoTotal,
    codigoReserva,
  };
};
