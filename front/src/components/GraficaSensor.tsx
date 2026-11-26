import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import {
  NIVELES,
  UMBRAL_PELIGRO,
  UMBRAL_PRECAUCION,
  VOLTAJE_MAX,
  aPorcentaje,
  formatoHora,
  nivelDe,
  voltajeDeUmbral,
  type Lectura,
} from '../lib/niveles';

interface Props {
  datos: Lectura[]; // de la más antigua a la más reciente
  compacta?: boolean;
}

// Mismos valores que los tokens (Recharts necesita colores directos)
const COLOR = {
  linea: '#0b6e79',
  seguro: '#2fae66',
  precaucion: '#d99a1e',
  peligro: '#e0483f',
  rejilla: '#dbe3e2',
  texto: '#4e6268',
};

function Globo({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const l = payload[0].payload as Lectura;
  const p = aPorcentaje(l.voltage);
  const nivel = nivelDe(p);
  return (
    <div className="chart-tip" data-nivel={nivel}>
      <time>{formatoHora(l.timestamp)}</time>
      <strong className="num">{l.voltage.toFixed(2)} V</strong>
      <span className="badge">{NIVELES[nivel].nombre}, {Math.round(p)}%</span>
    </div>
  );
}

export default function GraficaSensor({ datos, compacta = false }: Props) {
  const v1 = voltajeDeUmbral(UMBRAL_PRECAUCION);
  const v2 = voltajeDeUmbral(UMBRAL_PELIGRO);

  return (
    <div className={`chart ${compacta ? 'chart--compacta' : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={datos} margin={{ top: 12, right: 12, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR.linea} stopOpacity={0.28} />
              <stop offset="100%" stopColor={COLOR.linea} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Bandas de nivel: el fondo dice si la lectura es segura */}
          <ReferenceArea y1={0} y2={v1} fill={COLOR.seguro} fillOpacity={0.07} ifOverflow="hidden" />
          <ReferenceArea y1={v1} y2={v2} fill={COLOR.precaucion} fillOpacity={0.09} ifOverflow="hidden" />
          <ReferenceArea y1={v2} y2={VOLTAJE_MAX + 0.2} fill={COLOR.peligro} fillOpacity={0.08} ifOverflow="hidden" />
          <ReferenceLine
            y={v2}
            stroke={COLOR.peligro}
            strokeDasharray="4 4"
            label={{ value: 'Peligro', position: 'insideTopRight', fill: COLOR.peligro, fontSize: 12 }}
          />

          <CartesianGrid stroke={COLOR.rejilla} vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) => formatoHora(t).slice(0, 5)}
            tick={{ fontSize: 12, fill: COLOR.texto }}
            tickLine={false}
            axisLine={{ stroke: COLOR.rejilla }}
            minTickGap={compacta ? 40 : 28}
          />
          <YAxis
            domain={[0, 3.5]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={(v) => `${v} V`}
            tick={{ fontSize: 12, fill: COLOR.texto }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<Globo />} cursor={{ stroke: COLOR.texto, strokeDasharray: '3 3' }} />
          <Area
            type="monotone"
            dataKey="voltage"
            stroke={COLOR.linea}
            strokeWidth={2.5}
            fill="url(#relleno)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
