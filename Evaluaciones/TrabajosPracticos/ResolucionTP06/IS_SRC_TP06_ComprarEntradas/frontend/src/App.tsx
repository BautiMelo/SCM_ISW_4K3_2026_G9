import { useState } from 'react';
import { cerrarSesion, obtenerSesion, ResultadoCompra, Sesion } from './api';
import { CompraPage } from './pages/CompraPage';
import { LoginPage } from './pages/LoginPage';
import { ResultadoPage } from './pages/ResultadoPage';

// Navegación mínima sin router: Mercado Pago vuelve a /resultado; el resto vive en la raíz
export const App = () => {
  const [sesion, setSesion] = useState<Sesion | null>(obtenerSesion());
  const [resultado, setResultado] = useState<ResultadoCompra | null>(null);
  const vueltaDeMercadoPago = window.location.pathname === '/resultado';

  const salir = () => {
    cerrarSesion();
    setSesion(null);
  };

  const volverAComprar = () => {
    setResultado(null);
    window.history.replaceState(null, '', '/');
  };

  let contenido;
  if (!sesion) {
    contenido = <LoginPage onIngresar={setSesion} />;
  } else if (resultado || vueltaDeMercadoPago) {
    contenido = <ResultadoPage resultado={resultado} onVolver={volverAComprar} />;
  } else {
    contenido = <CompraPage onCompraRealizada={setResultado} />;
  }

  return (
    <div className="pagina">
      <header className="encabezado">
        <h1>🌳 EcoHarmony Park</h1>
        {sesion && (
          <div className="usuario">
            <span>{sesion.usuario.nombre}</span>
            <button type="button" className="boton-link" onClick={salir}>Salir</button>
          </div>
        )}
      </header>
      <main className="tarjeta">{contenido}</main>
    </div>
  );
};
