import { randomUUID } from 'crypto';
import { CompraError } from '../errors/compraError';
import {
  Compra, DependenciasCompra, EstadoCompra, Mail, RepositorioCompras, ResultadoCompra, SolicitudCompra, Usuario,
  Visitante,
} from '../models/compra';

const FORMAS_PAGO = ['EFECTIVO', 'TARJETA'];
const TIPOS_PASE = ['VIP', 'REGULAR'];
// getDay(): 0 = domingo, 1 = lunes, ..., 6 = sábado
const DIAS_SEMANA_CERRADOS = [1];
// Feriados en que cierra, como 'MM-DD': 25 de diciembre y 1 de enero
const FERIADOS_CERRADOS = ['12-25', '01-01'];
const CANTIDAD_MAXIMA_ENTRADAS = 10;
const EDAD_MAXIMA = 120;
const PRECIOS_PASE: Record<string, number> = { REGULAR: 10000, VIP: 20000 };
const EDAD_MAXIMA_SIN_CARGO = 3;
// El parque abre de 8:30 a 19:00; para el mismo día se vende hasta 1 hora y media antes del cierre
const HORA_LIMITE_COMPRA_MISMO_DIA = { horas: 17, minutos: 30 };
const EDAD_MAXIMA_MENOR_CON_DESCUENTO = 15;
const EDAD_MINIMA_MAYOR_CON_DESCUENTO = 60;

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

// Mismo día del mes siguiente; si ese mes es más corto (ej. 31/01 -> febrero), su último día
export const calcularFechaLimiteCompra = (fechaActual: Date): Date => {
  const ultimoDiaMesSiguiente = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 2, 0).getDate();
  return new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth() + 1,
    Math.min(fechaActual.getDate(), ultimoDiaMesSiguiente),
  );
};

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

const inicioDelDia = (fecha: Date): Date => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

const validarHorarioCompraMismoDia = (fechaVisita: Date, fechaActual: Date): void => {
  const esHoy = fechaVisita.getTime() === inicioDelDia(fechaActual).getTime();
  const minutosActuales = fechaActual.getHours() * 60 + fechaActual.getMinutes();
  const minutosLimite = HORA_LIMITE_COMPRA_MISMO_DIA.horas * 60 + HORA_LIMITE_COMPRA_MISMO_DIA.minutos;
  if (esHoy && minutosActuales > minutosLimite) {
    throw new CompraError('Las entradas para hoy se pueden comprar hasta las 17:30 (el parque cierra a las 19:00)');
  }
};

const validarAnticipacionMaxima = (fechaVisita: Date, fechaActual: Date): void => {
  const fechaLimite = calcularFechaLimiteCompra(fechaActual);
  if (fechaVisita > fechaLimite) {
    throw new CompraError(
      `Solo se pueden comprar entradas con hasta un mes de anticipación (hasta el ${formatearFecha(fechaLimite)})`,
    );
  }
};

// Valida que la fecha exista y esté dentro de la ventana de venta: desde hoy (hasta las 17:30) hasta dentro de un mes
export const validarFechaVisita = (fechaTexto: string, fechaActual: Date): Date => {
  const fechaVisita = parsearFecha(fechaTexto);
  // Si Date "corrigió" la fecha (ej. 31/02 -> 03/03), la fecha no existe
  const esFechaExistente = /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
    && fechaVisita.getDate() === Number(fechaTexto.split('-')[2]);
  if (!esFechaExistente) {
    throw new CompraError('Debe indicar una fecha de visita válida (AAAA-MM-DD)');
  }

  if (fechaVisita < inicioDelDia(fechaActual)) {
    throw new CompraError('La fecha de visita debe ser hoy o una fecha futura');
  }
  validarHorarioCompraMismoDia(fechaVisita, fechaActual);
  validarAnticipacionMaxima(fechaVisita, fechaActual);

  return fechaVisita;
};

export const validarDiaApertura = (fechaVisita: Date): void => {
  const mesDia = `${String(fechaVisita.getMonth() + 1).padStart(2, '0')}-${String(fechaVisita.getDate()).padStart(2, '0')}`;
  if (DIAS_SEMANA_CERRADOS.includes(fechaVisita.getDay()) || FERIADOS_CERRADOS.includes(mesDia)) {
    throw new CompraError(
      'El parque está cerrado ese día. Abre todos los días excepto los lunes, el 25 de diciembre y el 1 de enero',
    );
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

// Las compras pendientes de pago no cuentan: si el usuario abandona Mercado Pago no queda bloqueado
const ESTADOS_QUE_SUMAN_AL_TOPE: EstadoCompra[] = ['RESERVADA', 'PAGADA'];

export const validarTopeEntradasPorFecha = async (
  usuario: Usuario,
  fechaVisita: string,
  cantidadEntradas: number,
  repositorioCompras: RepositorioCompras,
): Promise<void> => {
  const comprasPrevias = await repositorioCompras.buscarPorUsuarioYFecha(usuario.id, fechaVisita);
  const entradasPrevias = comprasPrevias
    .filter((compra) => ESTADOS_QUE_SUMAN_AL_TOPE.includes(compra.estado))
    .reduce((total, compra) => total + compra.cantidadEntradas, 0);

  if (entradasPrevias + cantidadEntradas > CANTIDAD_MAXIMA_ENTRADAS) {
    throw new CompraError(
      `Solo se pueden comprar ${CANTIDAD_MAXIMA_ENTRADAS} entradas por fecha. `
      + `Ya tenés ${entradasPrevias} para el ${formatearFecha(parsearFecha(fechaVisita))}: `
      + `podés comprar hasta ${CANTIDAD_MAXIMA_ENTRADAS - entradasPrevias} más`,
    );
  }
};

// Hasta 3 años no pagan; hasta 15 años y desde 60 años pagan la mitad del precio del pase
const calcularPrecioEntrada = (edad: number, tipoPase: string): number => {
  const precioPase = PRECIOS_PASE[tipoPase];
  if (edad <= EDAD_MAXIMA_SIN_CARGO) {
    return 0;
  }
  if (edad <= EDAD_MAXIMA_MENOR_CON_DESCUENTO || edad >= EDAD_MINIMA_MAYOR_CON_DESCUENTO) {
    return precioPase / 2;
  }
  return precioPase;
};

export const calcularMontoTotal = (visitantes: Visitante[]): number =>
  visitantes.reduce((total, visitante) => total + calcularPrecioEntrada(visitante.edad!, visitante.tipoPase!), 0);

const describirEntradas = (compra: Compra): string =>
  `${compra.cantidadEntradas} entradas para el ${formatearFecha(parsearFecha(compra.fechaVisita))}`;

const armarResultado = (compra: Compra): ResultadoCompra => ({
  mensaje: `Compra realizada con éxito: ${describirEntradas(compra)}`,
  cantidadEntradas: compra.cantidadEntradas,
  fechaVisita: compra.fechaVisita,
  montoTotal: compra.montoTotal,
  codigoReserva: compra.codigoReserva,
});

// RESERVADA (efectivo): se paga en boletería. PAGADA (tarjeta): ya se cobró por Mercado Pago.
const armarMailConfirmacion = (compra: Compra): Mail => {
  const esReserva = compra.estado === 'RESERVADA';
  return {
    destinatario: compra.usuario.email,
    asunto: `EcoHarmony Park - Confirmación de tu ${esReserva ? 'reserva' : 'compra'}`,
    cuerpo: `
      <h2>¡Gracias por tu ${esReserva ? 'reserva' : 'compra'}, ${compra.usuario.nombre}!</h2>
      <p>${esReserva ? 'Reservaste' : 'Compraste'} <strong>${describirEntradas(compra)}</strong>.</p>
      <p>${esReserva ? 'Total a pagar en boletería' : 'Total pagado con Mercado Pago'}: <strong>$${compra.montoTotal}</strong></p>
      <p>Código de reserva: <strong>${compra.codigoReserva}</strong> (presentalo en el ingreso al parque)</p>`,
  };
};

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
  await validarTopeEntradasPorFecha(
    solicitud.usuario as Usuario,
    solicitud.fechaVisita,
    solicitud.cantidadEntradas,
    dependencias.repositorioCompras,
  );

  // A partir de acá la solicitud ya cumple todos los criterios de aceptación
  const pagaConTarjeta = solicitud.formaPago === 'TARJETA';
  const compra: Compra = {
    codigoReserva: randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase(),
    usuario: solicitud.usuario as Usuario,
    fechaVisita: solicitud.fechaVisita,
    cantidadEntradas: solicitud.cantidadEntradas,
    visitantes: solicitud.visitantes,
    formaPago: solicitud.formaPago as string,
    montoTotal: calcularMontoTotal(solicitud.visitantes),
    estado: pagaConTarjeta ? 'PENDIENTE_PAGO' : 'RESERVADA',
  };
  await dependencias.repositorioCompras.guardar(compra);

  if (pagaConTarjeta) {
    // El mail se envía recién cuando Mercado Pago aprueba el pago (ver confirmarPago)
    const urlPago = await dependencias.pasarelaPago.crearPago({
      codigoReserva: compra.codigoReserva,
      montoTotal: compra.montoTotal,
      descripcion: `${compra.cantidadEntradas} entradas EcoHarmony Park para el ${formatearFecha(fechaVisita)}`,
    });
    return { ...armarResultado(compra), urlPago };
  }

  await dependencias.enviadorMail.enviar(armarMailConfirmacion(compra));
  return armarResultado(compra);
};

export const confirmarPago = async (
  codigoReserva: string,
  idPago: string,
  dependencias: DependenciasCompra,
): Promise<ResultadoCompra> => {
  const compra = await dependencias.repositorioCompras.buscarPorCodigo(codigoReserva);
  if (!compra) {
    throw new CompraError(`No existe una compra con el código ${codigoReserva}`);
  }

  // Si el usuario recarga la página de resultado no se vuelve a enviar el mail
  if (compra.estado === 'PAGADA') {
    return armarResultado(compra);
  }

  const pago = await dependencias.pasarelaPago.consultarPago(idPago);
  if (pago.codigoReserva !== codigoReserva) {
    throw new CompraError('El pago no corresponde a esta compra');
  }
  if (pago.estado !== 'approved') {
    throw new CompraError('El pago no fue aprobado por Mercado Pago');
  }

  const compraPagada: Compra = { ...compra, estado: 'PAGADA' };
  await dependencias.repositorioCompras.guardar(compraPagada);
  await dependencias.enviadorMail.enviar(armarMailConfirmacion(compraPagada));
  return armarResultado(compraPagada);
};
