import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import Usuario from "../models/User";

declare global {
    namespace Express {
        interface Request {
            usuario?: Usuario
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No autorizado')
        res.status(401).json({error: error.message})
        return
    }

    const [, token ] = bearer.split(' ')

    if (!token) {
        const error = new Error('Token Inválido')
        res.status(401).json({error: error.message})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof decoded === 'object' && decoded.id) {
            req.usuario = await Usuario.findByPk(decoded.id, {
                attributes: ['id']
            })

            if (!req.usuario) {
                res.status(401).json({ error: 'Usuario no encontrado' })
            }
            next()
        }
    } catch (error) {
        res.status(401).json({ error: 'Token inválido'})
    }

}