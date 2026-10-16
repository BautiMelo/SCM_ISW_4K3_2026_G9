import { useState } from 'react';

interface CalendarioProps {
  fechasDisponibles: string[]; // AAAA-MM-DD habilitadas; el resto se muestra deshabilitado
  fechaSeleccionada: string;
  onSeleccionar: (fecha: string) => void;
}

const NOMBRES_DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const aTextoFecha = (anio: number, mes: number, dia: number): string =>
  `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

// Calendario mensual propio: el <input type="date"> nativo no permite deshabilitar días puntuales (lunes, feriados)
export const Calendario = ({ fechasDisponibles, fechaSeleccionada, onSeleccionar }: CalendarioProps) => {
  const primeraDisponible = fechasDisponibles[0] ?? aTextoFecha(new Date().getFullYear(), new Date().getMonth(), 1);
  const ultimaDisponible = fechasDisponibles[fechasDisponibles.length - 1] ?? primeraDisponible;
  const [anioInicial, mesInicial] = primeraDisponible.split('-').map(Number);
  const [mesVisible, setMesVisible] = useState({ anio: anioInicial, mes: mesInicial - 1 });

  const { anio, mes } = mesVisible;
  const diasDelMes = new Date(anio, mes + 1, 0).getDate();
  // Columnas de lunes a domingo: getDay() devuelve 0 para el domingo
  const huecosIniciales = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const claveMesVisible = aTextoFecha(anio, mes, 1).slice(0, 7);
  const hayMesAnterior = claveMesVisible > primeraDisponible.slice(0, 7);
  const hayMesSiguiente = claveMesVisible < ultimaDisponible.slice(0, 7);

  const cambiarMes = (desplazamiento: number) => {
    const nuevaFecha = new Date(anio, mes + desplazamiento, 1);
    setMesVisible({ anio: nuevaFecha.getFullYear(), mes: nuevaFecha.getMonth() });
  };

  const textoMes = new Date(anio, mes, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const nombreMes = textoMes.charAt(0).toUpperCase() + textoMes.slice(1);

  return (
    <div className="calendario">
      <div className="calendario-encabezado">
        <button type="button" onClick={() => cambiarMes(-1)} disabled={!hayMesAnterior} aria-label="Mes anterior">‹</button>
        <span className="calendario-mes">{nombreMes}</span>
        <button type="button" onClick={() => cambiarMes(1)} disabled={!hayMesSiguiente} aria-label="Mes siguiente">›</button>
      </div>
      <div className="calendario-grilla">
        {NOMBRES_DIAS.map((nombre) => <span key={nombre} className="calendario-dia-semana">{nombre}</span>)}
        {Array.from({ length: huecosIniciales }, (_, i) => <span key={`hueco-${i}`} />)}
        {Array.from({ length: diasDelMes }, (_, i) => {
          const fecha = aTextoFecha(anio, mes, i + 1);
          const disponible = fechasDisponibles.includes(fecha);
          return (
            <button
              key={fecha}
              type="button"
              className={`calendario-dia${fecha === fechaSeleccionada ? ' seleccionado' : ''}`}
              disabled={!disponible}
              aria-pressed={fecha === fechaSeleccionada}
              aria-label={`${i + 1} de ${nombreMes}${disponible ? '' : ' (no disponible)'}`}
              onClick={() => onSeleccionar(fecha)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
