// Acceso al backend. Toda la validación de negocio la hace la API: acá solo se muestran sus mensajes.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const CLAVE_SESION = 'ecoharmony-sesion';

export interface Sesion {
  token: string;
  usuario: { id: number; nombre: string; email: string };
}

export interface VisitanteForm {
  edad: string;
  tipoPase: 'REGULAR' | 'VIP';
  esJubilado: boolean;
}

export interface ResultadoCompra {
  mensaje: string;
  cantidadEntradas: number;
  fechaVisita: string;
  montoTotal: number;
  codigoReserva: string;
  urlPago?: string;
}

// sessionStorage: la sesión sobrevive a la ida y vuelta a Mercado Pago en la misma pestaña
export const obtenerSesion = (): Sesion | null => {
  try {
    const guardada = sessionStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
};

export const cerrarSesion = (): void => sessionStorage.removeItem(CLAVE_SESION);

const llamarApi = async <T>(ruta: string, cuerpo: unknown): Promise<T> => {
  const sesion = obtenerSesion();
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sesion ? { Authorization: `Bearer ${sesion.token}` } : {}),
      },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está levantado el backend?');
  }

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.mensaje ?? 'Ocurrió un error inesperado');
  }
  return datos as T;
};

export const iniciarSesion = async (email: string, password: string): Promise<Sesion> => {
  const sesion = await llamarApi<Sesion>('/auth/login', { email, password });
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
};

export const comprarEntradas = (datos: {
  fechaVisita: string;
  cantidadEntradas: number;
  visitantes: VisitanteForm[];
  formaPago?: string;
}): Promise<ResultadoCompra> => llamarApi<ResultadoCompra>('/compras', {
  ...datos,
  // El input de edad es texto; vacío viaja como null para que la API informe que falta
  visitantes: datos.visitantes.map((v) => ({ ...v, edad: v.edad === '' ? null : Number(v.edad) })),
});

export const confirmarPago = (codigoReserva: string, idPago: string): Promise<ResultadoCompra> =>
  llamarApi<ResultadoCompra>(`/compras/${codigoReserva}/confirmar-pago`, { idPago });
