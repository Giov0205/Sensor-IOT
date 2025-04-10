import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GraficaSensor from '../components/GraficaSensor'; // ✅ Gráfica de lecturas
import '../styles/Home.css'; // Reutiliza los estilos de Home

export default function Lecturas() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="home-title">LECTURAS</h1>
        <p className="home-subtitle">
          Visualiza las últimas mediciones captadas por el sensor de calidad del aire.
        </p>

        {/* Contenedor de la gráfica */}
        <div className="gauge-card">
          <GraficaSensor />
        </div>
      </div>
    </div>
  );
}
