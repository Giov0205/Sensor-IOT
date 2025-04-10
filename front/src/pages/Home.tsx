import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // 🔥 Nuevo header
import AireGauge from '../components/AireGuage'; // Asegúrate que esté bien escrito
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="home-title">INICIO</h1>
        <p className="home-subtitle">
          Bienvenido al sistema de monitoreo de calidad del aire.
        </p>

        <div className="gauge-card">
          <AireGauge />
        </div>
      </div>
    </div>
  );
}
