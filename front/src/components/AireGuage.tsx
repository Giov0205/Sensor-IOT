import { useMemo } from 'react';
import {
  UMBRAL_PELIGRO,
  UMBRAL_PRECAUCION,
  type Nivel,
} from '../lib/niveles';
import { cssVars } from '../lib/css';

interface Props {
  porcentaje: number | null;
  voltaje: number | null;
  nivel: Nivel;
}

const C = 160; // centro del SVG
const R_ESCALA = 146;
const INICIO = 135; // grados, el arco cubre 270°
const BARRIDO = 270;
const ANILLOS = [34, 54, 74, 94, 114];

const polar = (radio: number, grados: number) => {
  const rad = (grados * Math.PI) / 180;
  return [C + radio * Math.cos(rad), C + radio * Math.sin(rad)];
};

const arco = (radio: number, desde: number, hasta: number) => {
  const [x1, y1] = polar(radio, desde);
  const [x2, y2] = polar(radio, hasta);
  const grande = hasta - desde > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radio} ${radio} 0 ${grande} 1 ${x2} ${y2}`;
};

/** Curva cerrada ondulada: más gas = más turbulencia en las isobaras. */
const isobara = (radio: number, indice: number, intensidad: number) => {
  const puntos = 72;
  const amp = 0.015 + 0.075 * intensidad;
  const fase = indice * 1.3;
  let d = '';
  for (let k = 0; k <= puntos; k++) {
    const t = (k / puntos) * Math.PI * 2;
    const r =
      radio *
      (1 +
        amp * Math.sin(3 * t + fase) +
        amp * 0.6 * Math.sin(5 * t - fase * 1.7) +
        amp * 0.3 * Math.cos(2 * t + fase * 0.5));
    const x = C + r * Math.cos(t);
    const y = C + r * Math.sin(t);
    d += `${k === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
};

/** Medidor principal de AirGuard (antes: gauge circular genérico). */
export default function AireGauge({ porcentaje, voltaje, nivel }: Props) {
  const valor = porcentaje ?? 0;
  const intensidad = valor / 100;

  const anillos = useMemo(
    () => ANILLOS.map((r, i) => isobara(r, i, intensidad)),
    // redondeado para no recalcular por décimas
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Math.round(valor)]
  );

  // Cuántos anillos se "llenan" (desde el centro hacia afuera)
  const llenos = Math.ceil((valor / 100) * ANILLOS.length);

  const marcas = Array.from({ length: 21 }, (_, i) => i * 5);
  const anguloDe = (p: number) => INICIO + (p / 100) * BARRIDO;

  return (
    <figure className="gauge" data-nivel={nivel}>
      <svg
        className="gauge__svg"
        viewBox="0 0 320 320"
        role="img"
        aria-label={
          porcentaje === null
            ? 'Sin lecturas del sensor'
            : `Concentración de gas ${Math.round(valor)} por ciento`
        }
      >
        {/* Isobaras */}
        <g className="gauge__rings">
          {anillos
            .map((d, i) => ({ d, i }))
            .reverse()
            .map(({ d, i }) => (
              <path
                key={i}
                d={d}
                className={`gauge__ring ${i < llenos ? 'is-on' : ''}`}
                style={cssVars({ '--i': i })}
              />
            ))}
        </g>

        {/* Escala */}
        <path className="gauge__track" d={arco(R_ESCALA, INICIO, INICIO + BARRIDO)} />
        <path
          className="gauge__fill"
          d={arco(R_ESCALA, INICIO, INICIO + BARRIDO)}
          pathLength={100}
          style={{ strokeDashoffset: 100 - valor }}
        />

        {marcas.map((p) => {
          // no dibujar marcas pegadas a las líneas de umbral
          const umbral =
            Math.abs(p - UMBRAL_PRECAUCION) < 3 || Math.abs(p - UMBRAL_PELIGRO) < 3;
          const [x1, y1] = polar(R_ESCALA - 12, anguloDe(p));
          const [x2, y2] = polar(R_ESCALA - (p % 25 === 0 ? 20 : 16), anguloDe(p));
          return umbral ? null : (
            <line key={p} x1={x1} y1={y1} x2={x2} y2={y2} className="gauge__tick" />
          );
        })}

        {[UMBRAL_PRECAUCION, UMBRAL_PELIGRO].map((p) => {
          const [x1, y1] = polar(R_ESCALA + 8, anguloDe(p));
          const [x2, y2] = polar(R_ESCALA - 22, anguloDe(p));
          return (
            <line
              key={`u${p}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={`gauge__threshold gauge__threshold--${p === UMBRAL_PELIGRO ? 'peligro' : 'precaucion'}`}
            />
          );
        })}
      </svg>

      <figcaption className="gauge__readout">
        <span className="gauge__value num">
          {porcentaje === null ? '––' : Math.round(valor)}
          <small>%</small>
        </span>
        <span className="gauge__volt num">
          {voltaje === null ? 'sin lectura' : `${voltaje.toFixed(2)} V`}
        </span>
      </figcaption>
    </figure>
  );
}
