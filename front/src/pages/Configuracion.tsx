import { BellRing, Cpu, Play, Server } from 'lucide-react';
import { SENSOR_URL, useSensor } from '../context/SensorContext';
import {
  NIVELES,
  UMBRAL_PELIGRO,
  UMBRAL_PRECAUCION,
  voltajeDeUmbral,
  type Nivel,
} from '../lib/niveles';
import '../styles/Config.css';

const RANGOS: { nivel: Nivel; desde: number; hasta: number }[] = [
  { nivel: 'seguro', desde: 0, hasta: UMBRAL_PRECAUCION },
  { nivel: 'precaucion', desde: UMBRAL_PRECAUCION, hasta: UMBRAL_PELIGRO },
  { nivel: 'peligro', desde: UMBRAL_PELIGRO, hasta: 100 },
];

export default function Configuracion() {
  const { sonidoActivo, setSonidoActivo, probarAlarma, conexion, lecturas } = useSensor();

  return (
    <div className="ajustes">
      <section className="panel" aria-labelledby="alarma-titulo">
        <header className="panel__head">
          <h2 id="alarma-titulo">
            <BellRing aria-hidden="true" /> Alarma sonora
          </h2>
        </header>
        <div className="setting">
          <div>
            <p className="setting__name" id="sonido-label">Sonar cuando haya peligro</p>
            <p className="setting__hint">
              La alarma se repite mientras el nivel siga en peligro. Puedes silenciarla desde el aviso rojo.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={sonidoActivo}
            aria-labelledby="sonido-label"
            className="switch"
            onClick={() => setSonidoActivo(!sonidoActivo)}
          >
            <span className="switch__thumb" />
          </button>
        </div>
        <div className="setting">
          <div>
            <p className="setting__name">Probar sonido</p>
            <p className="setting__hint">Reproduce la alarma durante 2 segundos.</p>
          </div>
          <button type="button" className="btn btn--secondary btn--sm" onClick={probarAlarma}>
            <Play aria-hidden="true" />
            Probar
          </button>
        </div>
      </section>

      <section className="panel" aria-labelledby="umbrales-titulo">
        <header className="panel__head">
          <h2 id="umbrales-titulo">Niveles del sensor</h2>
        </header>
        <div className="scale" aria-hidden="true">
          {RANGOS.map((r) => (
            <span
              key={r.nivel}
              data-nivel={r.nivel}
              style={{ flexGrow: r.hasta - r.desde }}
            />
          ))}
        </div>
        <ul className="levels">
          {RANGOS.map((r) => (
            <li key={r.nivel} data-nivel={r.nivel}>
              <span className="badge">{NIVELES[r.nivel].nombre}</span>
              <span className="num levels__range">
                {voltajeDeUmbral(r.desde).toFixed(2)} a {voltajeDeUmbral(r.hasta).toFixed(2)} V
              </span>
              <span className="levels__pct num">
                {r.desde} a {r.hasta}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="conexion-titulo">
        <header className="panel__head">
          <h2 id="conexion-titulo">Conexión</h2>
        </header>
        <dl className="kv">
          <div>
            <dt>
              <Server aria-hidden="true" /> Servidor
            </dt>
            <dd className="num">{SENSOR_URL}</dd>
          </div>
          <div>
            <dt>
              <Cpu aria-hidden="true" /> Estado
            </dt>
            <dd>
              {conexion === 'en-linea'
                ? `En línea, ${lecturas.length} lecturas guardadas`
                : conexion === 'cargando'
                  ? 'Conectando…'
                  : 'Sin conexión con el servidor'}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
