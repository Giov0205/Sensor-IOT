// El login guarda el token con esta clave
export const CLAVE_TOKEN = 'TOKEN';

export const obtenerToken = () => {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
};

export const guardarToken = (token: string) => {
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
  } catch {
    /* sin almacenamiento disponible */
  }
};

export const cerrarSesion = () => {
  try {
    localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    /* sin almacenamiento disponible */
  }
};
