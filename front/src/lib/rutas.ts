import { Activity, BellRing, Gauge, SlidersHorizontal } from 'lucide-react';

// Secciones de la app (las usan el riel y la barra inferior)
export const RUTAS = [
  { to: '/home', label: 'Monitor', icon: Gauge },
  { to: '/lecturas', label: 'Lecturas', icon: Activity },
  { to: '/alertas', label: 'Alertas', icon: BellRing },
  { to: '/config', label: 'Ajustes', icon: SlidersHorizontal },
];
