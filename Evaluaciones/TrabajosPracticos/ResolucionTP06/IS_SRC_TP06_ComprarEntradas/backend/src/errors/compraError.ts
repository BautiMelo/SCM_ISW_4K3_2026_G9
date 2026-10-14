// Error de negocio: la solicitud no cumple un criterio de aceptación. La API lo devuelve como 400.
export class CompraError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'CompraError';
  }
}
