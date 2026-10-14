import { FormEvent, useState } from 'react';
import { comprarEntradas, ResultadoCompra, VisitanteForm } from '../api';

interface CompraPageProps {
  onCompraRealizada: (resultado: ResultadoCompra) => void;
}

const VISITANTE_INICIAL: VisitanteForm = { edad: '', tipoPase: 'REGULAR', esJubilado: false };
// Mismas reglas que valida la API: acá solo sirven para avisar apenas se carga el dato
const CANTIDAD_MAXIMA_ENTRADAS = 10;
const DIAS_CERRADOS = [2, 4]; // getDay(): 2 = martes, 4 = jueves

const esDiaCerrado = (fecha: string): boolean => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return DIAS_CERRADOS.includes(new Date(anio, mes - 1, dia).getDay());
};

// Fecha local en formato AAAA-MM-DD (toISOString usaría UTC y de noche daría el día siguiente)
const hoyComoTexto = (): string => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

export const CompraPage = ({ onCompraRealizada }: CompraPageProps) => {
  const [fechaVisita, setFechaVisita] = useState('');
  const [cantidadEntradas, setCantidadEntradas] = useState(1);
  const [visitantes, setVisitantes] = useState<VisitanteForm[]>([{ ...VISITANTE_INICIAL }]);
  const [formaPago, setFormaPago] = useState<string>();
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

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
        window.location.href = resultado.urlPago; // tarjeta: redirige a Mercado Pago
        return;
      }
      onCompraRealizada(resultado);
    } catch (e) {
      setError((e as Error).message);
    }
    setEnviando(false);
  };

  const avisoFecha = fechaVisita && esDiaCerrado(fechaVisita)
    ? 'El parque está cerrado los martes y jueves. Elegí otro día.'
    : '';
  const avisoCantidad = cantidadEntradas > CANTIDAD_MAXIMA_ENTRADAS
    ? `No se pueden comprar más de ${CANTIDAD_MAXIMA_ENTRADAS} entradas.`
    : '';

  // Sin validaciones "required": las reglas las aplica la API y acá se muestra su mensaje
  return (
    <form onSubmit={confirmarCompra} className="formulario" noValidate>
      <h2>Comprar entradas</h2>
      <p className="ayuda">El parque abre todos los días excepto martes y jueves.</p>

      <div className="fila">
        <label>
          Fecha de visita
          <input
            type="date"
            min={hoyComoTexto()}
            value={fechaVisita}
            aria-invalid={Boolean(avisoFecha)}
            onChange={(e) => setFechaVisita(e.target.value)}
          />
          {avisoFecha && <span className="aviso" role="alert">⚠ {avisoFecha}</span>}
        </label>
        <label>
          Cantidad de entradas (máx. 10)
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
      </div>

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
                <option value="REGULAR">Regular ($6.000)</option>
                <option value="VIP">VIP ($10.000)</option>
              </select>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={visitante.esJubilado}
                onChange={(e) => cambiarVisitante(indice, { esJubilado: e.target.checked })}
              />
              Jubilado
            </label>
          </div>
        ))}
        <p className="ayuda">Menores de 12 años y jubilados pagan la mitad.</p>
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
