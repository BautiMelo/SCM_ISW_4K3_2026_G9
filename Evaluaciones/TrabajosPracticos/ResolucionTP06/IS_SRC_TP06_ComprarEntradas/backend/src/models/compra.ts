export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

// Opcionales porque la solicitud llega desde afuera y puede venir incompleta: comprarEntradas la valida
export interface Visitante {
  edad?: number;
  tipoPase?: string;
  esJubilado?: boolean;
}

export interface SolicitudCompra {
  usuario?: Usuario;
  fechaVisita: string; // formato AAAA-MM-DD
  cantidadEntradas: number;
  visitantes: Visitante[];
  formaPago?: string;
}

export interface Mail {
  destinatario: string;
  asunto: string;
  cuerpo: string; // HTML
}

export interface EnviadorMail {
  enviar: (mail: Mail) => Promise<void>;
}

export interface DependenciasCompra {
  fechaActual: Date;
  enviadorMail: EnviadorMail;
}

export interface ResultadoCompra {
  mensaje: string;
  cantidadEntradas: number;
  fechaVisita: string;
  montoTotal: number;
  codigoReserva: string;
}
