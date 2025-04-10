import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TablaAlertas.css';

interface Alerta {
  voltage: number;
  timestamp: string;
}

const TablaAlertas = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://10.1.1.83:4000/api/sensores');
        const filtradas = res.data
          .filter((dato: Alerta) => dato.voltage > 2.2)
          .slice(0, 7); // ✅ Solo las 10 alertas más recientes
        setAlertas(filtradas);
      } catch (error) {
        console.error('Error al obtener alertas:', error);
      }
    };

    fetchData();
    const intervalo = setInterval(fetchData, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="alerta-wrapper">
      <h2 className="alerta-titulo">Alertas recientes</h2>
      <table className="alerta-tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Voltaje (V)</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {alertas.map((alerta, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td className="peligroso">{alerta.voltage.toFixed(2)}</td>
              <td>{new Date(alerta.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAlertas;
