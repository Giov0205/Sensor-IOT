import { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import TablaAlertas from '../components/TablaAlertas';
import { useAhora, useSensor } from '../context/SensorContext';
import { UMBRAL_PELIGRO, agruparEpisodios, voltajeDeUmbral } from '../lib/niveles';

export default function Alertas() {
  const { lecturas, conexion } = useSensor();
  const ahora = useAhora(5000);
  const episodios = useMemo(() => agruparEpisodios(lecturas), [lecturas]);

  return (
    <section className="panel alertas" aria-labelledby="alertas-titulo">
      <header className="panel__head">
        <div>
          <h2 id="alertas-titulo">
            {episodios.length === 0
              ? 'Historial de alertas'
              : `${episodios.length} ${episodios.length === 1 ? 'episodio' : 'episodios'} de gas`}
          </h2>
          <p className="panel__hint">
            Un episodio empieza cuando el sensor pasa de {voltajeDeUmbral(UMBRAL_PELIGRO).toFixed(2)} V
            ({UMBRAL_PELIGRO}%) y termina cuando baja de nuevo.
          </p>
        </div>
      </header>

      {episodios.length === 0 ? (
        conexion === 'cargando' ? (
          <div className="alertas__skeleton" aria-label="Cargando alertas">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : (
          <div className="empty empty--tall empty--stack">
            <ShieldCheck aria-hidden="true" />
            <p>
              <strong>Sin alertas registradas.</strong>
              <br />
              Cuando el sensor detecte gas, el episodio aparecerá aquí con su hora, duración y pico.
            </p>
          </div>
        )
      ) : (
        <TablaAlertas episodios={episodios} ahora={ahora} />
      )}
    </section>
  );
}
