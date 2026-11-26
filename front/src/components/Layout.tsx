import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { Siren, Volume2, VolumeX } from 'lucide-react';
import Sidebar from './Sidebar';
import { RUTAS } from '../lib/rutas';
import Header from './Header';
import { SensorProvider, useSensor } from '../context/SensorContext';
import { NIVELES } from '../lib/niveles';
import { obtenerToken } from '../lib/sesion';
import '../styles/Home.css';

function BannerAlarma() {
  const { nivel, alarmaSonando, audioBloqueado, silenciar, activarAudio, sonidoActivo, silenciada } =
    useSensor();
  if (nivel !== 'peligro') return null;

  return (
    <div className="alarm" role="alert">
      <Siren className="alarm__icon" aria-hidden="true" />
      <div className="alarm__text">
        <strong>{NIVELES.peligro.titulo}</strong>
        <span>{NIVELES.peligro.consejo}</span>
      </div>
      {alarmaSonando && (
        <button type="button" className="btn btn--sm alarm__btn" onClick={silenciar}>
          <VolumeX aria-hidden="true" />
          Silenciar alarma
        </button>
      )}
      {!alarmaSonando && audioBloqueado && sonidoActivo && !silenciada && (
        <button type="button" className="btn btn--sm alarm__btn" onClick={activarAudio}>
          <Volume2 aria-hidden="true" />
          Activar sonido
        </button>
      )}
    </div>
  );
}

function Shell() {
  const { nivel } = useSensor();
  return (
    <div className="shell" data-nivel={nivel}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Sidebar />
      <div className="shell__main">
        <Header />
        <BannerAlarma />
        <main id="contenido" className="shell__content">
          <Outlet />
        </main>
      </div>

      <nav className="tabbar" aria-label="Navegación principal">
        {RUTAS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="tabbar__link">
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function Layout() {
  if (!obtenerToken()) return <Navigate to="/" replace />;
  return (
    <SensorProvider>
      <Shell />
    </SensorProvider>
  );
}
