import rateLimit from 'express-rate-limit';

// Límite general para toda la API -- red de seguridad básica contra abuso.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, intenta de nuevo más tarde.' },
});

// Límite más estricto solo para /api/auth: es el punto de entrada que más
// interesa frenar (fuerza bruta de login, registro masivo de cuentas). El
// bloqueo por intentos fallidos (auth.service.js) ya protege una cuenta
// puntual; esto protege el endpoint en sí contra un atacante probando
// muchos correos distintos.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos de autenticación, intenta de nuevo más tarde.' },
});
