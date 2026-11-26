import {
  aPorcentaje,
  duracion,
  formatoFecha,
  formatoHora,
  haceCuanto,
  type Episodio,
} from '../lib/niveles';
import '../styles/TablaAlertas.css';

interface Props {
  episodios: Episodio[];
  ahora: number;
}

export default function TablaAlertas({ episodios, ahora }: Props) {
  return (
    <table className="alerts">
      <caption className="sr-only">Episodios de gas detectado, del más reciente al más antiguo</caption>
      <thead>
        <tr>
          <th scope="col">Inicio</th>
          <th scope="col">Duración</th>
          <th scope="col">Pico</th>
          <th scope="col">Lecturas</th>
        </tr>
      </thead>
      <tbody>
        {episodios.map((e) => {
          const pico = aPorcentaje(e.pico);
          const ms = new Date(e.fin).getTime() - new Date(e.inicio).getTime() + 1000;
          return (
            <tr key={e.inicio}>
              <td data-label="Inicio" className="alerts__when">
                <strong className="num">{formatoHora(e.inicio)}</strong>
                <span>
                  {formatoFecha(e.inicio)}, {haceCuanto(e.inicio, ahora)}
                </span>
              </td>
              <td data-label="Duración" className="num">{duracion(ms)}</td>
              <td data-label="Pico">
                <span className="alerts__peak">
                  <span className="alerts__meter" aria-hidden="true">
                    <span style={{ width: `${pico}%` }} />
                  </span>
                  <span className="num">
                    {Math.round(pico)}% <small>{e.pico.toFixed(2)} V</small>
                  </span>
                </span>
              </td>
              <td data-label="Lecturas" className="num">{e.lecturas}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
