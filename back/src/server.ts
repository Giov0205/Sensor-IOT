import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { db } from './config/db'
import { corsConfig } from './config/cors'
import authRouter from './routes/authRouter'
import sensorRouter from './routes/sensorRouter';


async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log('Conexión exitosa a la BD');
    } catch (error) {
        // console.log(error);
        console.log('Falló la conexión a la BD');
    }
}
connectDB()
const app = express()

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.use(express.json())

app.use('/auth', authRouter)

app.use(sensorRouter);

export default app