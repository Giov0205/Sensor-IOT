import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Volume2, VolumeX } from 'lucide-react';
import Brand from './Brand';
import { haceCuanto } from '../lib/niveles';
import { useAhora, useSensor } from '../context/SensorContext';
import { cerrarSesion } from '../lib/sesion';
import '../styles/Header.css';

const TITULOS: Record<string, { titulo: string; detalle: string }> = {
  '/home': { titulo: 'Monitor', detalle: 'Calidad del aire en este momento' },
  '/lecturas': { titulo: 'Lecturas', detalle: 'Historial de mediciones del sensor' },
  '/alertas': { titulo: 'Alertas', detalle: 'Episodios en los que se detectó gas' },
  '/config': { titulo: 'Ajustes', detalle: 'Alarma, umbrales y conexión' },
};

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { conexion, ultima, sonidoActivo, setSonidoActivo } = useSensor();
  const ahora = useAhora();
  const pagina = TITULOS[pathname] ?? TITULOS['/home'];

  const estado =
    conexion === 'sin-conexion'
      ? 'Sin conexión'
      : conexion === 'cargando'
        ? 'Conectando…'
        : ultima
          ? `En vivo, ${haceCuanto(ultima.timestamp, ahora)}`
          : 'En vivo';

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <Brand />
      </div>

      <div className="topbar__title">
        <h1>{pagina.titulo}</h1>
        <p>{pagina.detalle}</p>
      </div>

      <div className="topbar__actions">
        <p className={`live live--${conexion}`} role="status">
          <span className="live__dot" aria-hidden="true" />
          <span className="live__text">{estado}</span>
          <span className="live__short" aria-hidden="true">
            {conexion === 'sin-conexion' ? 'Sin conexión' : conexion === 'cargando' ? 'Conectando' : 'En vivo'}
          </span>
        </p>

        <button
          type="button"
          className="icon-btn"
          aria-pressed={sonidoActivo}
          aria-label={sonidoActivo ? 'Apagar sonido de alarma' : 'Encender sonido de alarma'}
          title={sonidoActivo ? 'Sonido de alarma encendido' : 'Sonido de alarma apagado'}
          onClick={() => setSonidoActivo(!sonidoActivo)}
        >
          {sonidoActivo ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        </button>

        <button
          type="button"
          className="icon-btn topbar__logout"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          onClick={() => {
            cerrarSesion();
            navigate('/', { replace: true });
          }}
        >
          <LogOut aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
