import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpToLine, Sigma, ShieldAlert } from 'lucide-react';
import GraficaSensor from '../components/GraficaSensor';
import { useSensor } from '../context/SensorContext';
import { UMBRAL_PELIGRO, aPorcentaje, nivelDe } from '../lib/niveles';
import '../styles/Lecturas.css';

const RANGOS = [
  { valor: 20, etiqueta: '20 lecturas' },
  { valor: 60, etiqueta: '60 lecturas' },
  { valor: 200, etiqueta: '200 lecturas' },
];

export default function Lecturas() {
  const { lecturas, conexion } = useSensor();
  const [rango, setRango] = useState(60);

  const datos = useMemo(() => lecturas.slice(0, rango).reverse(), [lecturas, rango]);

  const stats = useMemo(() => {
    if (!datos.length) return null;
    const v = datos.map((d) => d.voltage);
    const min = Math.min(...v);
    const max = Math.max(...v);
    const prom = v.reduce((a, b) => a + b, 0) / v.length;
    const peligro = v.filter((x) => aPorcentaje(x) >= UMBRAL_PELIGRO).length;
    return { min, max, prom, peligro };
  }, [datos]);

  const tarjetas = stats
    ? [
        { titulo: 'Mínimo', valor: `${stats.min.toFixed(2)} V`, nivel: nivelDe(aPorcentaje(stats.min)), icono: ArrowDownToLine },
        { titulo: 'Máximo', valor: `${stats.max.toFixed(2)} V`, nivel: nivelDe(aPorcentaje(stats.max)), icono: ArrowUpToLine },
        { titulo: 'Promedio', valor: `${stats.prom.toFixed(2)} V`, nivel: nivelDe(aPorcentaje(stats.prom)), icono: Sigma },
        {
          titulo: 'En peligro',
          valor: `${stats.peligro} de ${datos.length}`,
          nivel: stats.peligro > 0 ? ('peligro' as const) : ('seguro' as const),
          icono: ShieldAlert,
        },
      ]
    : [];

  return (
    <div className="lecturas">
      <section className="panel panel--chart" aria-labelledby="grafica-titulo">
        <header className="panel__head lecturas__head">
          <div>
            <h2 id="grafica-titulo">Voltaje del sensor</h2>
            <p className="panel__hint">
              El fondo verde, ámbar y rojo marca el nivel seguro, de precaución y de peligro.
            </p>
          </div>
          <div className="segmented" role="radiogroup" aria-label="Cantidad de lecturas">
            {RANGOS.map((r) => (
              <button
                key={r.valor}
                type="button"
                role="radio"
                aria-checked={rango === r.valor}
                className="segmented__opt"
                onClick={() => setRango(r.valor)}
              >
                {r.etiqueta}
              </button>
            ))}
          </div>
        </header>

        {datos.length === 0 ? (
          conexion === 'cargando' ? (
            <div className="skeleton chart-skeleton" aria-label="Cargando lecturas" />
          ) : (
            <p className="empty empty--tall">
              Aún no hay lecturas. Cuando el ESP32 envíe datos, la gráfica se dibujará sola.
            </p>
          )
        ) : (
          <GraficaSensor datos={datos} />
        )}
      </section>

      {stats && (
        <ul className="stats" aria-label={`Resumen de las últimas ${datos.length} lecturas`}>
          {tarjetas.map(({ titulo, valor, nivel, icono: Icono }) => (
            <li key={titulo} className="stat" data-nivel={nivel}>
              <Icono aria-hidden="true" className="stat__icon" />
              <span className="stat__title">{titulo}</span>
              <strong className="stat__value num">{valor}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
