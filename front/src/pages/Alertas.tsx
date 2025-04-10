import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TablaAlertas from '../components/TablaAlertas'; // 👈 Componente de la tabla
import '../styles/Home.css'; // Puedes usar el mismo estilo base

export default function Alertas() {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="home-title">ALERTAS</h1>
        <p className="home-subtitle">
          Aquí puedes visualizar las alertas de gas detectadas recientemente.
        </p>

        <TablaAlertas />
      </div>
    </div>
  );
}
