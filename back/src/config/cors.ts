import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [
      process.env.FRONTEND_URL,          // Tu frontend
      'http://localhost:5173',           // Por si estás en local
      'http://10.1.1.83',         // IP local para pruebas
      undefined                          // Para ESP32 o Postman sin origin
    ];

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para:', origin);
      callback(new Error('Error de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
