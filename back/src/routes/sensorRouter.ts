import { Router } from 'express';
const { recibirDatosSensor, obtenerDatosSensor } = require('../controller/SensorController');


const router = Router();

router.post('/api/sensores', recibirDatosSensor);

router.get('/api/sensores', obtenerDatosSensor);

export default router;
