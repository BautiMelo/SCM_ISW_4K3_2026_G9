import { FormEvent, useEffect, useRef, useState } from 'react';
import { consultarEstadoPago, comprarEntradas, obtenerFechasDisponibles, ResultadoCompra, VisitanteForm } from '../api';
import { Calendario } from '../components/Calendario';

interface CompraPageProps {
  onCompraRealizada: (resultado: ResultadoCompra) => void;
}

const VISITANTE_INICIAL: VisitanteForm = { edad: '', tipoPase: 'REGULAR' };
// Misma regla que valida la API: acá solo sirve para avisar apenas se carga el dato
const CANTIDAD_MAXIMA_ENTRADAS = 10;

const formatearFecha = (fecha: string): string => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
};

export const CompraPage = ({ onCompraRealizada }: CompraPageProps) => {
  const [fechasDisponibles, setFechasDisponibles] = useState<string[] | null>(null);
  const [fechaVisita, setFechaVisita] = useState('');
  const [cantidadEntradas, setCantidadEntradas] = useState(1);
  const [visitantes, setVisitantes] = useState<VisitanteForm[]>([{ ...VISITANTE_INICIAL }]);
  const [formaPago, setFormaPago] = useState<string>();
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  // Compra con tarjeta en espera: se abre Mercado Pago en una ventana y se consulta el pago cada 2 segundos
  const [pagoEnCurso, setPagoEnCurso] = useState<{ codigoReserva: string; urlPago: string } | null>(null);
  const [avisoPago, setAvisoPago] = useState('');
  const ventanaPago = useRef<Window | null>(null);

  useEffect(() => {
    obtenerFechasDisponibles().then(setFechasDisponibles).catch((e: Error) => setError(e.message));
  }, []);

  // La lista de visitantes acompaña a la cantidad de entradas (una fila por entrada)
  const cambiarCantidad = (valor: string) => {
    const cantidad = Number(valor);
    setCantidadEntradas(cantidad);
    if (Number.isInteger(cantidad) && cantidad >= 0 && cantidad <= CANTIDAD_MAXIMA_ENTRADAS) {
      setVisitantes((actuales) => Array.from({ length: cantidad }, (_, i) => actuales[i] ?? { ...VISITANTE_INICIAL }));
    }
  };

  const cambiarVisitante = (indice: number, cambios: Partial<VisitanteForm>) => {
    setVisitantes((actuales) => actuales.map((v, i) => (i === indice ? { ...v, ...cambios } : v)));
  };

  const confirmarCompra = async (evento: FormEvent) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const resultado = await comprarEntradas({ fechaVisita, cantidadEntradas, visitantes, formaPago });
      if (resultado.urlPago) {
        // Tarjeta: Mercado Pago se abre en una ventana y el pago se sigue acá por polling
        abrirMercadoPago(resultado.urlPago);
        setPagoEnCurso({ codigoReserva: resultado.codigoReserva, urlPago: resultado.urlPago });
        setEnviando(false);
        return;
      }
      onCompraRealizada(resultado);
    } catch (e) {
      setError((e as Error).message);
    }
    setEnviando(false);
  };

  const abrirMercadoPago = (urlPago: string) => {
    ventanaPago.current = window.open(urlPago, 'mercadopago', 'width=800,height=700');
  };

  const cancelarPago = () => {
    ventanaPago.current?.close();
    setPagoEnCurso(null);
    setAvisoPago('');
  };

  useEffect(() => {
    if (!pagoEnCurso) return;
    let consultaEnCurso = false; // no solaparse si un request tarda más que el intervalo
    const intervalo = setInterval(async () => {
      if (consultaEnCurso) return;
      consultaEnCurso = true;
      try {
        const info = await consultarEstadoPago(pagoEnCurso.codigoReserva);
        if (info.estado === 'PAGADA' && info.resultado) {
          setPagoEnCurso(null);
          onCompraRealizada(info.resultado);
        } else if (info.pagoMercadoPago === 'rejected') {
          setAvisoPago('El pago fue rechazado. Podés reintentarlo en la ventana de Mercado Pago o cancelar la compra.');
        } else {
          setAvisoPago('');
        }
      } catch (e) {
        setAvisoPago((e as Error).message);
      } finally {
        consultaEnCurso = false;
      }
    }, 2000);
    return () => clearInterval(intervalo);
  }, [pagoEnCurso, onCompraRealizada]);

  if (pagoEnCurso) {
    const ventanaCerrada = !ventanaPago.current || ventanaPago.current.closed;
    return (
      <div className="resultado">
        <p className="icono">💳</p>
        <h2>Completá el pago en Mercado Pago</h2>
        <p>
          Reserva <strong>{pagoEnCurso.codigoReserva}</strong> en espera: cuando se apruebe el pago,
          esta página muestra el resultado sola.
        </p>
        {avisoPago && <p className="error" role="alert">{avisoPago}</p>}
        {ventanaCerrada && <p className="ayuda">La ventana de Mercado Pago está cerrada.</p>}
        <div className="botones">
          <button type="button" className="boton" onClick={() => abrirMercadoPago(pagoEnCurso.urlPago)}>
            {ventanaCerrada ? 'Abrir Mercado Pago' : 'Abrir Mercado Pago de nuevo'}
          </button>
          <button type="button" className="boton" onClick={cancelarPago}>Cancelar compra</button>
        </div>
      </div>
    );
  }

  const avisoCantidad = cantidadEntradas > CANTIDAD_MAXIMA_ENTRADAS
    ? `No se pueden comprar más de ${CANTIDAD_MAXIMA_ENTRADAS} entradas.`
    : '';

  // Sin validaciones "required": las reglas las aplica la API y acá se muestra su mensaje
  return (
    <form onSubmit={confirmarCompra} className="formulario" noValidate>
      <h2>Comprar entradas</h2>
      <p className="ayuda">
        Abierto de 8:30 a 19:00, todos los días excepto los lunes, el 25/12 y el 1/1.
        Podés comprar con hasta un mes de anticipación.
      </p>

      <fieldset>
        <legend>Fecha de visita</legend>
        {fechasDisponibles
          ? <Calendario fechasDisponibles={fechasDisponibles} fechaSeleccionada={fechaVisita} onSeleccionar={setFechaVisita} />
          : <p className="ayuda">Cargando fechas disponibles…</p>}
        <p className="fecha-elegida">
          {fechaVisita ? <>Fecha elegida: <strong>{formatearFecha(fechaVisita)}</strong></> : 'Elegí un día en el calendario.'}
        </p>
      </fieldset>

      <label>
        Cantidad de entradas (máx. {CANTIDAD_MAXIMA_ENTRADAS} por fecha)
        <input
          type="number"
          min={1}
          max={CANTIDAD_MAXIMA_ENTRADAS}
          value={cantidadEntradas}
          aria-invalid={Boolean(avisoCantidad)}
          onChange={(e) => cambiarCantidad(e.target.value)}
        />
        {avisoCantidad && <span className="aviso" role="alert">⚠ {avisoCantidad}</span>}
      </label>

      <fieldset>
        <legend>Visitantes</legend>
        {visitantes.map((visitante, indice) => (
          <div className="visitante" key={indice}>
            <span className="numero">#{indice + 1}</span>
            <label>
              Edad
              <input
                type="number"
                min={0}
                value={visitante.edad}
                onChange={(e) => cambiarVisitante(indice, { edad: e.target.value })}
              />
            </label>
            <label>
              Tipo de pase
              <select
                value={visitante.tipoPase}
                onChange={(e) => cambiarVisitante(indice, { tipoPase: e.target.value as VisitanteForm['tipoPase'] })}
              >
                <option value="REGULAR">Común ($10.000)</option>
                <option value="VIP">VIP ($20.000)</option>
              </select>
            </label>
          </div>
        ))}
        <p className="ayuda">Hasta 3 años no pagan. Hasta 15 años y desde 60 años pagan la mitad.</p>
      </fieldset>

      <fieldset>
        <legend>Forma de pago</legend>
        <label className="check">
          <input type="radio" name="formaPago" value="EFECTIVO" checked={formaPago === 'EFECTIVO'} onChange={() => setFormaPago('EFECTIVO')} />
          Efectivo (pago en boletería)
        </label>
        <label className="check">
          <input type="radio" name="formaPago" value="TARJETA" checked={formaPago === 'TARJETA'} onChange={() => setFormaPago('TARJETA')} />
          Tarjeta (Mercado Pago)
        </label>
      </fieldset>

      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" className="boton" disabled={enviando}>{enviando ? 'Procesando…' : 'Confirmar compra'}</button>
    </form>
  );
};
