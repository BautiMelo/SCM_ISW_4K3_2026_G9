import { Compra, RepositorioCompras } from '../models/compra';

// Mock de base de datos: las compras viven en memoria mientras el servidor está levantado
export const crearRepositorioComprasEnMemoria = (): RepositorioCompras => {
  const compras = new Map<string, Compra>();

  return {
    guardar: async (compra) => {
      compras.set(compra.codigoReserva, { ...compra });
    },
    buscarPorCodigo: async (codigoReserva) => {
      const compra = compras.get(codigoReserva);
      return compra ? { ...compra } : undefined;
    },
  };
};
