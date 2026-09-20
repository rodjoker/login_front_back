import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    // No distinguimos "expirado" de "inválido" acá a propósito -- de cara
    // al cliente el remedio es el mismo (volver a loguearse), y no vale la
    // pena darle a un atacante información extra sobre por qué falló.
    throw new AppError('Token inválido o expirado', 401);
  }
}
