import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

// Exención para suite de tests
const skipTests = () => env.nodeEnv === 'test';

// 1. loginLimiter: 10 intentos fallidos cada 15 minutos por IP
// Justificación: Frena ataques de fuerza bruta y password spraying sobre hashes bcrypt sin penalizar inicios de sesión legítimos.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skip: skipTests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos fallidos. Inténtalo de nuevo en 15 minutos.' }
});

// 2. registerLimiter: 5 registros por hora por IP
// Justificación: Previene la creación masiva de cuentas falsas, abuso de CPU al hashear contraseñas y spam sin afectar al usuario común.
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  skip: skipTests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Límite de registros alcanzado para esta IP. Inténtalo más tarde.' }
});