import { FormEvent, useState } from 'react';
import { iniciarSesion, Sesion } from '../api';

interface LoginPageProps {
  onIngresar: (sesion: Sesion) => void;
}

export const LoginPage = ({ onIngresar }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const ingresar = async (evento: FormEvent) => {
    evento.preventDefault();
    setError('');
    setCargando(true);
    try {
      onIngresar(await iniciarSesion(email, password));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={ingresar} className="formulario">
      <h2>Iniciá sesión para comprar tus entradas</h2>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Contraseña
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" className="boton" disabled={cargando}>{cargando ? 'Ingresando…' : 'Ingresar'}</button>
      <p className="ayuda">Usuario de prueba: visitante@ecoharmony.test / visitante123</p>
    </form>
  );
};
