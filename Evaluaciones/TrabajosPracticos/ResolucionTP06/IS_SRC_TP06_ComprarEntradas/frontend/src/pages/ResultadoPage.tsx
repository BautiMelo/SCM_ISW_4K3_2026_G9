import { useEffect, useState } from 'react';
import { confirmarPago, ResultadoCompra } from '../api';

interface ResultadoPageProps {
  resultado: ResultadoCompra | null; // viene cargado si pagó en efectivo
  onVolver: () => void;
}

// Mercado Pago vuelve a /resultado?payment_id=...&status=...&external_reference=<codigoReserva>
const leerVueltaDeMercadoPago = () => {
  const parametros = new URLSearchParams(window.location.search);
  return {
    idPago: parametros.get('payment_id') ?? parametros.get('collection_id'),
    codigoReserva: parametros.get('external_reference'),
  };
};

export const ResultadoPage = ({ resultado: resultadoInicial, onVolver }: ResultadoPageProps) => {
  const [resultado, setResultado] = useState(resultadoInicial);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resultadoInicial) return;
    const { idPago, codigoReserva } = leerVueltaDeMercadoPago();
    if (!idPago || !codigoReserva || idPago === 'null') {
      setError('El pago no se completó. Podés intentar la compra nuevamente.');
      return;
    }
    confirmarPago(codigoReserva, idPago).then(setResultado).catch((e: Error) => setError(e.message));
  }, [resultadoInicial]);

  if (error) {
    return (
      <div className="resultado">
        <p className="icono">❌</p>
        <h2>No se pudo completar la compra</h2>
        <p className="error">{error}</p>
        <button type="button" className="boton" onClick={onVolver}>Volver a comprar</button>
      </div>
    );
  }

  if (!resultado) {
    return <p className="resultado">Confirmando el pago con Mercado Pago…</p>;
  }

  return (
    <div className="resultado">
      <p className="icono">✅</p>
      <h2>{resultado.mensaje}</h2>
      <p>Total: <strong>${resultado.montoTotal.toLocaleString('es-AR')}</strong></p>
      <p>Código de reserva: <strong>{resultado.codigoReserva}</strong></p>
      <p className="ayuda">Te enviamos un mail de confirmación con estos datos.</p>
      <button type="button" className="boton" onClick={onVolver}>Hacer otra compra</button>
    </div>
  );
};
