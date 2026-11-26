import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { aPorcentaje, nivelDe, type Lectura, type Nivel } from '../lib/niveles';

// Dirección del backend que recibe los datos del ESP32
export const SENSOR_URL =
  import.meta.env.VITE_SENSOR_URL ?? 'http://10.1.1.83:4000';

const INTERVALO_MS = 1000;
const CLAVE_SONIDO = 'airguard:sonido';

type Conexion = 'cargando' | 'en-linea' | 'sin-conexion';

interface SensorState {
  lecturas: Lectura[]; // más reciente primero
  ultima: Lectura | null;
  porcentaje: number | null;
  nivel: Nivel;
  conexion: Conexion;
  sonidoActivo: boolean;
  setSonidoActivo: (v: boolean) => void;
  alarmaSonando: boolean;
  audioBloqueado: boolean;
  silenciar: () => void;
  silenciada: boolean;
  activarAudio: () => void;
  probarAlarma: () => void;
}

const SensorContext = createContext<SensorState | null>(null);

const leerPreferencia = () => {
  try {
    return localStorage.getItem(CLAVE_SONIDO) !== 'off';
  } catch {
    return true;
  }
};

export function SensorProvider({ children }: { children: ReactNode }) {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [conexion, setConexion] = useState<Conexion>('cargando');
  const [sonidoActivo, setSonidoState] = useState(leerPreferencia);
  const [silenciada, setSilenciada] = useState(false);
  const [alarmaSonando, setAlarmaSonando] = useState(false);
  const [audioBloqueado, setAudioBloqueado] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio('/sounds/alarma.mp3');
    audioRef.current.loop = true;
  }

  // Sondeo del backend
  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const res = await axios.get<Lectura[]>(`${SENSOR_URL}/api/sensores`, {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!activo) return;
        const datos = (res.data ?? []).map((d) => ({
          ...d,
          voltage: Number(d.voltage),
        }));
        setLecturas(datos);
        setConexion('en-linea');
      } catch (err) {
        if (!activo) return;
        console.error('Error al obtener datos del sensor:', err);
        setConexion('sin-conexion');
      }
    };
    cargar();
    const id = setInterval(cargar, INTERVALO_MS);
    return () => {
      activo = false;
      clearInterval(id);
    };
  }, []);

  const ultima = lecturas[0] ?? null;
  const porcentaje = ultima ? aPorcentaje(ultima.voltage) : null;
  const nivel = nivelDe(porcentaje);

  const detener = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setAlarmaSonando(false);
  }, []);

  const reproducir = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.paused) return;
    a.play()
      .then(() => {
        setAlarmaSonando(true);
        setAudioBloqueado(false);
      })
      .catch(() => setAudioBloqueado(true)); // el navegador pide un clic primero
  }, []);

  // Alarma: suena en peligro, se calla al bajar el nivel
  useEffect(() => {
    if (nivel === 'peligro') {
      if (sonidoActivo && !silenciada) reproducir();
      else detener();
    } else {
      detener();
      setSilenciada(false);
    }
  }, [nivel, sonidoActivo, silenciada, reproducir, detener]);

  useEffect(() => detener, [detener]);

  const setSonidoActivo = useCallback((v: boolean) => {
    setSonidoState(v);
    try {
      localStorage.setItem(CLAVE_SONIDO, v ? 'on' : 'off');
    } catch {
      /* sin almacenamiento: solo dura esta sesión */
    }
  }, []);

  const silenciar = useCallback(() => {
    setSilenciada(true);
    detener();
  }, [detener]);

  const activarAudio = useCallback(() => {
    setAudioBloqueado(false);
    reproducir();
  }, [reproducir]);

  const probarAlarma = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play()
      .then(() => {
        setAlarmaSonando(true);
        window.setTimeout(() => {
          if (nivel !== 'peligro') detener();
        }, 2000);
      })
      .catch(() => setAudioBloqueado(true));
  }, [nivel, detener]);

  const value = useMemo<SensorState>(
    () => ({
      lecturas,
      ultima,
      porcentaje,
      nivel,
      conexion,
      sonidoActivo,
      setSonidoActivo,
      alarmaSonando,
      audioBloqueado,
      silenciar,
      silenciada,
      activarAudio,
      probarAlarma,
    }),
    [
      lecturas,
      ultima,
      porcentaje,
      nivel,
      conexion,
      sonidoActivo,
      setSonidoActivo,
      alarmaSonando,
      audioBloqueado,
      silenciar,
      silenciada,
      activarAudio,
      probarAlarma,
    ]
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
}

export function useSensor() {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error('useSensor debe usarse dentro de <SensorProvider>');
  return ctx;
}

/** Reloj que avanza cada segundo, para textos tipo "hace 5 s". */
export function useAhora(intervalo = 1000) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), intervalo);
    return () => clearInterval(id);
  }, [intervalo]);
  return ahora;
}
