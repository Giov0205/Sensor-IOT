import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { RUTAS } from '../lib/rutas';
import Brand from './Brand';
import { useSensor } from '../context/SensorContext';
import { cerrarSesion } from '../lib/sesion';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { conexion } = useSensor();

  const salir = () => {
    cerrarSesion();
    navigate('/', { replace: true });
  };

  return (
    <nav className="rail" aria-label="Navegación principal">
      <div className="rail__brand">
        <Brand inversa />
      </div>

      <ul className="rail__list">
        {RUTAS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} className="rail__link">
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="rail__footer">
        <p className={`rail__device rail__device--${conexion}`}>
          <span className="rail__device-dot" aria-hidden="true" />
          <span>
            ESP32
            <small>
              {conexion === 'en-linea'
                ? 'Conectado'
                : conexion === 'cargando'
                  ? 'Buscando…'
                  : 'Sin conexión'}
            </small>
          </span>
        </p>
        <button type="button" className="rail__logout" onClick={salir}>
          <LogOut aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
