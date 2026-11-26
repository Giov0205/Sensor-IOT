interface BrandProps {
  compacta?: boolean;
  inversa?: boolean;
}

/** Marca de AirGuard: curvas de concentración alrededor de un punto de medición. */
export default function Brand({ compacta = false, inversa = false }: BrandProps) {
  return (
    <span className={`brand ${inversa ? 'brand--inversa' : ''}`}>
      <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M16 4.5c6.6 0 11.5 4.6 11.5 11.2 0 6.8-5 11.8-11.6 11.8S4.5 22.6 4.5 16.1C4.5 9.4 9.3 4.5 16 4.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          opacity="0.45"
        />
        <path
          d="M16 9.2c4 0 6.9 2.8 6.9 6.8 0 4.1-3 7-7 7-4 0-6.8-3-6.8-6.9 0-4 2.9-6.9 6.9-6.9Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity="0.75"
        />
        <circle cx="16" cy="16" r="3.2" fill="currentColor" />
      </svg>
      {!compacta && <span className="brand__name">AirGuard</span>}
    </span>
  );
}
