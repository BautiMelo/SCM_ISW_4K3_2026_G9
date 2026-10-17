import { UsuarioRegistrado } from '../models/compra';

// Mock de usuarios registrados (no hay base de datos). Son datos de prueba, no secretos.
// USUARIO_DEMO_EMAIL en el .env reemplaza el mail de "visitante" para recibir la confirmación en una casilla real.
export const crearUsuarios = (usuarioDemoEmail: string): UsuarioRegistrado[] => [
  { id: 1, nombre: 'Visitante Demo', email: usuarioDemoEmail || 'visitante@ecoharmony.test', password: 'visitante123' },
  { id: 2, nombre: 'Ana', email: 'ana@ecoharmony.test', password: 'ana12345' },
];
