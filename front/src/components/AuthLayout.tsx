import type { ReactNode } from 'react';
import Brand from './Brand';
import '../styles/Login.css';
import { cssVars } from '../lib/css';

const curva = (radio: number, fase: number) => {
  let d = '';
  for (let k = 0; k <= 90; k++) {
    const t = (k / 90) * Math.PI * 2;
    const r = radio * (1 + 0.06 * Math.sin(3 * t + fase) + 0.035 * Math.sin(5 * t - fase));
    d += `${k ? 'L' : 'M'} ${(300 + r * Math.cos(t)).toFixed(1)} ${(300 + r * Math.sin(t)).toFixed(1)} `;
  }
  return `${d}Z`;
};

const CURVAS = Array.from({ length: 9 }, (_, i) => curva(40 + i * 30, i * 0.9));

interface Props {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  pie: ReactNode;
}

export default function AuthLayout({ titulo, subtitulo, children, pie }: Props) {
  return (
    <div className="auth">
      <aside className="auth__aside" aria-hidden="true">
        <Brand inversa />
        <svg className="auth__map" viewBox="0 0 600 600">
          {CURVAS.map((d, i) => (
            <path key={i} d={d} style={cssVars({ '--i': i })} />
          ))}
          <circle cx="300" cy="300" r="7" />
        </svg>
        <p className="auth__claim">
          Cada curva es una lectura del aire. AirGuard te avisa antes de que el gas sea un riesgo.
        </p>
      </aside>

      <main className="auth__main">
        <div className="auth__card">
          <div className="auth__brand-mobile">
            <Brand />
          </div>
          <h1 className="auth__title">{titulo}</h1>
          <p className="auth__subtitle">{subtitulo}</p>
          {children}
          <div className="auth__foot">{pie}</div>
        </div>
      </main>
    </div>
  );
}
