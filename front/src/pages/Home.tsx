import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleCheck, ShieldAlert, TriangleAlert, WifiOff } from 'lucide-react';
import AireGauge from '../components/AireGuage';
import { useAhora, useSensor } from '../context/SensorContext';
import {
  NIVELES,
  aPorcentaje,
  agruparEpisodios,
  duracion,
  formatoHora,
  haceCuanto,
  nivelDe,
} from '../lib/niveles';
import { cssVars } from '../lib/css';

const ICONO_NIVEL = {
  seguro: CircleCheck,
  precaucion: TriangleAlert,
  peligro: ShieldAlert,
  'sin-datos': WifiOff,
};

export default function Home() {
  const { lecturas, ultima, porcentaje, nivel, conexion } = useSensor();
  const ahora = useAhora();
  const info = NIVELES[nivel];
  const IconoNivel = ICONO_NIVEL[nivel];

  const { picoHoy, episodiosHoy, recientes, tira } = useMemo(() => {
    const hoy = new Date().toDateString();
    const deHoy = lecturas.filter((l) => new Date(l.timestamp).toDateString() === hoy);
    const episodios = agruparEpisodios(lecturas);
    return {
      picoHoy: deHoy.length ? Math.max(...deHoy.map((l) => aPorcentaje(l.voltage))) : null,
      episodiosHoy: episodios.filter((e) => new Date(e.inicio).toDateString() === hoy).length,
      recientes: episodios.slice(0, 3),
      tira: lecturas.slice(0, 40).reverse(),
    };
  }, [lecturas]);

  const cargando = conexion === 'cargando' && !ultima;

  return (
    <div className="monitor">
      <section className="hero" aria-labelledby="estado-titulo" data-nivel={nivel}>
        <div className="hero__gauge">
          {cargando ? (
            <div className="skeleton hero__gauge-skeleton" aria-hidden="true" />
          ) : (
            <AireGauge porcentaje={porcentaje} voltaje={ultima?.voltage ?? null} nivel={nivel} />
          )}
        </div>

        <div className="hero__status">
          <span className="badge">
            <IconoNivel aria-hidden="true" />
            {info.nombre}
          </span>
          <h2 id="estado-titulo" className="hero__title" aria-live="polite">
            {cargando ? 'Conectando con el sensor' : info.titulo}
          </h2>
          <p className="hero__advice">
            {conexion === 'sin-conexion' && !ultima
              ? `No hay respuesta del servidor. Revisa que el backend esté encendido en la red local.`
              : info.consejo}
          </p>

          <dl className="facts">
            <div className="facts__item">
              <dt>Última lectura</dt>
              <dd className="num">{ultima ? formatoHora(ultima.timestamp) : '––'}</dd>
              <dd className="facts__sub">{ultima ? haceCuanto(ultima.timestamp, ahora) : 'sin datos'}</dd>
            </div>
            <div className="facts__item">
              <dt>Pico de hoy</dt>
              <dd className="num" data-nivel={nivelDe(picoHoy)}>
                {picoHoy === null ? '––' : `${Math.round(picoHoy)}%`}
              </dd>
              <dd className="facts__sub">{picoHoy === null ? 'sin lecturas hoy' : 'concentración máxima'}</dd>
            </div>
            <div className="facts__item">
              <dt>Alertas de hoy</dt>
              <dd className="num">{episodiosHoy}</dd>
              <dd className="facts__sub">{episodiosHoy === 1 ? 'episodio' : 'episodios'}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="monitor__grid">
        <section className="panel" aria-labelledby="tira-titulo">
          <header className="panel__head">
            <h3 id="tira-titulo">Últimas lecturas</h3>
            <Link to="/lecturas" className="panel__link">
              Ver historial <ArrowRight aria-hidden="true" />
            </Link>
          </header>
          {tira.length === 0 ? (
            <p className="empty">Las lecturas aparecerán aquí en cuanto el sensor envíe datos.</p>
          ) : (
            <>
              <ol className="strip" aria-label="Últimas lecturas, de la más antigua a la más reciente">
                {tira.map((l, i) => {
                  const p = aPorcentaje(l.voltage);
                  return (
                    <li
                      key={l.id ?? `${l.timestamp}-${i}`}
                      className="strip__bar"
                      data-nivel={nivelDe(p)}
                      style={cssVars({ '--s': Math.max(0.04, p / 100) })}
                      title={`${formatoHora(l.timestamp)}: ${Math.round(p)}%`}
                    >
                      <span className="sr-only">
                        {formatoHora(l.timestamp)}, {Math.round(p)}%
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="strip__legend">
                <span>{formatoHora(tira[0].timestamp)}</span>
                <span>{formatoHora(tira[tira.length - 1].timestamp)}</span>
              </p>
            </>
          )}
        </section>

        <section className="panel" aria-labelledby="recientes-titulo">
          <header className="panel__head">
            <h3 id="recientes-titulo">Alertas recientes</h3>
            <Link to="/alertas" className="panel__link">
              Ver todas <ArrowRight aria-hidden="true" />
            </Link>
          </header>
          {recientes.length === 0 ? (
            <p className="empty">
              <CircleCheck aria-hidden="true" />
              Sin alertas registradas.
            </p>
          ) : (
            <ul className="mini-alerts">
              {recientes.map((e) => (
                <li key={e.inicio}>
                  <ShieldAlert aria-hidden="true" />
                  <span>
                    <strong className="num">{Math.round(aPorcentaje(e.pico))}%</strong> de pico,
                    duró {duracion(new Date(e.fin).getTime() - new Date(e.inicio).getTime() + 1000)}
                  </span>
                  <time dateTime={e.inicio}>{haceCuanto(e.inicio, ahora)}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
