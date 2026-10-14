export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Visitante {
  edad: number;
  tipoPase: string;
}

export interface SolicitudCompra {
  usuario?: Usuario;
  fechaVisita: string; // formato AAAA-MM-DD
  cantidadEntradas: number;
  visitantes: Visitante[];
  formaPago?: string;
}

export interface DependenciasCompra {
  fechaActual: Date;
}

export interface ResultadoCompra {
  mensaje: string;
  cantidadEntradas: number;
  fechaVisita: string;
}
