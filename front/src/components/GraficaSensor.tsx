import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

interface SensorDato {
  timestamp: string;
  voltage: number;
}

const GraficaSensor = () => {
  const [datos, setDatos] = useState<SensorDato[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://10.1.1.83:4000/api/sensores');
        const ultimos = res.data.slice(0, 10).reverse();
        setDatos(ultimos);
      } catch (err) {
        console.error('Error al obtener datos del sensor:', err);
      }
    };

    fetchData();
    const intervalo = setInterval(fetchData, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '900px',
        height: '400px',
        margin: '40px auto',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <h2 style={{ color: '#1e293b', marginBottom: '20px', textAlign: 'center' }}>
        Histórico
      </h2>

      <div style={{ width: '100%', height: 'calc(100% - 50px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={50}
              tickFormatter={(tick) =>
                new Intl.DateTimeFormat('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).format(new Date(tick))
              }
            />
            <YAxis domain={[0, 3.5]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any) => `${value} V`}
              labelFormatter={(label) =>
                new Intl.DateTimeFormat('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                }).format(new Date(label))
              }
            />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaSensor;
