// Reglas de lectura del sensor de gas (ESP32, 0 a 3.3 V)

export const VOLTAJE_MAX = 3.3;
export const UMBRAL_PRECAUCION = 33; // %
export const UMBRAL_PELIGRO = 66; // %

export type Nivel = 'seguro' | 'precaucion' | 'peligro' | 'sin-datos';

export interface Lectura {
  id?: number;
  voltage: number;
  timestamp: string;
}

export const aPorcentaje = (voltaje: number) =>
  Math.min(100, Math.max(0, (voltaje / VOLTAJE_MAX) * 100));

export const nivelDe = (porcentaje: number | null): Nivel => {
  if (porcentaje === null || Number.isNaN(porcentaje)) return 'sin-datos';
  if (porcentaje < UMBRAL_PRECAUCION) return 'seguro';
  if (porcentaje < UMBRAL_PELIGRO) return 'precaucion';
  return 'peligro';
};

export const NIVELES: Record<
  Nivel,
  { nombre: string; titulo: string; consejo: string }
> = {
  seguro: {
    nombre: 'Seguro',
    titulo: 'Aire limpio',
    consejo: 'No se detecta gas. El área se puede usar con normalidad.',
  },
  precaucion: {
    nombre: 'Precaución',
    titulo: 'Gas en aumento',
    consejo:
      'Hay presencia de gas. Abre ventanas y revisa estufas, tanques o conexiones cercanas.',
  },
  peligro: {
    nombre: 'Peligro',
    titulo: 'Gas detectado',
    consejo:
      'Sal del área, no enciendas aparatos eléctricos ni flamas y ventila de inmediato.',
  },
  'sin-datos': {
    nombre: 'Sin datos',
    titulo: 'Esperando al sensor',
    consejo:
      'Todavía no llegan lecturas. Revisa que el ESP32 esté encendido y conectado a la red.',
  },
};

export const voltajeDeUmbral = (porcentaje: number) =>
  (porcentaje / 100) * VOLTAJE_MAX;

const hora = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});
const fechaCorta = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
});

export const formatoHora = (fecha: string | Date) => hora.format(new Date(fecha));
export const formatoFecha = (fecha: string | Date) =>
  fechaCorta.format(new Date(fecha));

export const haceCuanto = (fecha: string | Date, ahora = Date.now()) => {
  const seg = Math.max(0, Math.round((ahora - new Date(fecha).getTime()) / 1000));
  if (seg < 5) return 'ahora mismo';
  if (seg < 60) return `hace ${seg} s`;
  const min = Math.round(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `el ${formatoFecha(fecha)}`;
};

export const duracion = (ms: number) => {
  const seg = Math.round(ms / 1000);
  if (seg < 60) return `${seg} s`;
  const min = Math.floor(seg / 60);
  const resto = seg % 60;
  return resto ? `${min} min ${resto} s` : `${min} min`;
};

export interface Episodio {
  inicio: string;
  fin: string;
  pico: number; // voltaje máximo
  lecturas: number;
}

/** Junta lecturas peligrosas seguidas en un solo episodio de alerta. */
export const agruparEpisodios = (lecturas: Lectura[], separacionMs = 20000) => {
  const peligrosas = lecturas
    .filter((l) => aPorcentaje(l.voltage) >= UMBRAL_PELIGRO)
    .sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  const episodios: Episodio[] = [];
  for (const l of peligrosas) {
    const ultimo = episodios[episodios.length - 1];
    const t = new Date(l.timestamp).getTime();
    if (ultimo && t - new Date(ultimo.fin).getTime() <= separacionMs) {
      ultimo.fin = l.timestamp;
      ultimo.pico = Math.max(ultimo.pico, l.voltage);
      ultimo.lecturas += 1;
    } else {
      episodios.push({ inicio: l.timestamp, fin: l.timestamp, pico: l.voltage, lecturas: 1 });
    }
  }
  return episodios.reverse(); // más reciente primero
};
