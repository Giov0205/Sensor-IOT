import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AireGauge = () => {
  const [valor, setValor] = useState(0);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const alertaSonando = useRef(false);
  const audioRef = useRef(new Audio('/sounds/alarma.mp3')); // 🔊 Ruta al sonido

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://10.1.1.83:4000/api/sensores', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        const datos = res.data;
        if (datos.length > 0) {
          const ultimo = parseFloat(datos[0].voltage);
          const porcentaje = Math.min(100, Math.max(0, (ultimo / 3.3) * 100));
          setValor(porcentaje);

          if (porcentaje >= 66) {
            setMostrarAlerta(true);

            // Solo sonar si no está ya sonando
            if (!alertaSonando.current) {
              alertaSonando.current = true;
              audioRef.current.play();
            }
          } else {
            setMostrarAlerta(false);
            alertaSonando.current = false;
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      } catch (err) {
        console.error('Error al obtener datos del sensor:', err);
      }
    };

    fetchData();
    const intervalo = setInterval(fetchData, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const getColor = (val: number) => {
    if (val < 33) return '#22c55e';
    if (val < 66) return '#eab308';
    return '#ef4444';
  };

  const getTexto = (val: number) => {
    if (val < 33) return 'Bueno';
    if (val < 66) return 'Regular';
    return '¡Peligro!';
  };

  return (
    <div style={{ width: 200, position: 'relative' }}>
      {mostrarAlerta && (
        <div style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 999
        }}>
          ⚠️ ¡ALERTA! GAS DETECTADO
        </div>
      )}

      <CircularProgressbar
        value={valor}
        maxValue={100}
        text={`${valor.toFixed(0)}%`}
        styles={buildStyles({
          textColor: '#1e293b',
          pathColor: getColor(valor),
          trailColor: '#e5e7eb',
        })}
      />
      <p style={{
        textAlign: 'center',
        marginTop: '10px',
        fontWeight: 'bold',
        fontSize: '16px',
        color: getColor(valor),
      }}>
        Estatus: {getTexto(valor)}
      </p>
    </div>
  );
};

export default AireGauge;
