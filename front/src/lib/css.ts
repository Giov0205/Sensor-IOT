import type { CSSProperties } from 'react';

/** Pasa variables CSS (--algo) por la prop style sin errores de tipos. */
export const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;
