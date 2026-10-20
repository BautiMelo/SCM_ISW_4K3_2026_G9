export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

// Opcionales porque la solicitud llega desde afuera y puede venir incompleta: comprarEntradas la valida
export interface Visitante {
  edad?: number;
  tipoPase?: string;
}

export interface SolicitudCompra {
  usuario?: Usuario;
  fechaVisita: string; // formato AAAA-MM-DD
  cantidadEntradas: number;
  visitantes: Visitante[];
  formaPago?: string;
}

// RESERVADA: paga en boletería (efectivo). PENDIENTE_PAGO: esperando a Mercado Pago. PAGADA: tarjeta aprobada.
// SIN_COSTO: monto $0 (todos los visitantes de hasta 3 años), no hay nada que cobrar.
export type EstadoCompra = 'RESERVADA' | 'PENDIENTE_PAGO' | 'PAGADA' | 'SIN_COSTO';

export interface Compra {
  codigoReserva: string;
  usuario: Usuario;
  fechaVisita: string;
  cantidadEntradas: number;
  visitantes: Visitante[];
  formaPago: string;
  montoTotal: number;
  estado: EstadoCompra;
}

export interface ResultadoCompra {
  mensaje: string;
  cantidadEntradas: number;
  fechaVisita: string;
  montoTotal: number;
  codigoReserva: string;
  urlPago?: string; // solo si paga con tarjeta
}

export interface Mail {
  destinatario: string;
  asunto: string;
  cuerpo: string; // HTML
}

export interface DatosPago {
  codigoReserva: string;
  montoTotal: number;
  descripcion: string;
}

export interface PagoConsultado {
  estado: string; // estado de Mercado Pago: approved, pending, rejected, ...
  codigoReserva: string; // external_reference con la que se creó el pago
}

// Dependencias externas que recibe el servicio. En producción son Gmail, Mercado Pago y un repositorio;
// en los tests se reemplazan por dobles para no enviar mails ni cobrar de verdad.
export interface EnviadorMail {
  enviar: (mail: Mail) => Promise<void>;
}

export interface PasarelaPago {
  crearPago: (datos: DatosPago) => Promise<string>; // devuelve la URL a la que se redirige al usuario
  consultarPago: (idPago: string) => Promise<PagoConsultado>;
  // Último pago de Mercado Pago con external_reference = codigoReserva (lo consulta el polling del frontend).
  // Si todavía no hay ningún pago, se rechaza con error: el servicio lo interpreta como "sigue esperando".
  buscarPagoPorReserva: (codigoReserva: string) => Promise<PagoConsultado>;
}

export interface RepositorioCompras {
  guardar: (compra: Compra) => Promise<void>;
  buscarPorCodigo: (codigoReserva: string) => Promise<Compra | undefined>;
  buscarPorUsuarioYFecha: (usuarioId: number, fechaVisita: string) => Promise<Compra[]>;
}

export interface DependenciasCompra {
  fechaActual: Date;
  enviadorMail: EnviadorMail;
  pasarelaPago: PasarelaPago;
  repositorioCompras: RepositorioCompras;
}

// Usuario tal como está guardado (mock de base de datos). La contraseña nunca sale de la API.
export interface UsuarioRegistrado extends Usuario {
  password: string;
}
