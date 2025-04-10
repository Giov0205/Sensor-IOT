import { Request, Response } from 'express';
import { SensorData } from '../models/SensorData';

export const recibirDatosSensor = async (req: Request, res: Response) => {
  const { voltage } = req.body;

  console.log('🔌 Datos recibidos desde ESP32:', req.body);

  if (!voltage) {
    return res.status(400).json({ message: 'Falta el valor de voltaje' });
  }

  try {
    const dato = await SensorData.create({ voltage });
    res.status(201).json(dato);
  } catch (error) {
    console.error('❌ Error al guardar en la base de datos:', error);
    res.status(500).json({ message: 'Error al guardar el dato', error });
  }
};

export const obtenerDatosSensor = async (req: Request, res: Response) => {
  try {
    const datos = await SensorData.findAll({
      order: [['timestamp', 'DESC']], // ✅ Ordenar por tu columna real
    });
    res.status(200).json(datos);
  } catch (error) {
    console.error('❌ Error al obtener datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos', error });
  }
};
