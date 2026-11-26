import { isAxiosError } from 'axios';

/** Saca un mensaje claro del error que regresa el backend. */
export const mensajeDeError = (error: unknown, respaldo: string) => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
    }
    const data = error.response.data as
      | { error?: string; message?: string; errors?: { msg: string }[] }
      | undefined;
    if (data?.error) return data.error;
    if (data?.errors?.length) return data.errors[0].msg;
    if (data?.message) return data.message;
  }
  return respaldo;
};
