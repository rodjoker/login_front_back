import { logger } from '../utils/logger.js';

// Handler global de errores -- SIEMPRE 4 parámetros, Express lo reconoce
// como error middleware por la firma, no por dónde está registrado.
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? 'Error interno del servidor';

  // Traduce errores "crudos" de Mongoose/JWT a respuestas HTTP claras, sin
  // que cada service tenga que saber de estos detalles.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' | ');
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
    message = `Ya existe un registro con ese valor de ${field}`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Id inválido: ${err.value}`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'El token expiró, vuelve a iniciar sesión';
  }

  // Un 5xx sí se loguea siempre -- es un bug real que alguien tiene que ver.
  // Un 4xx es "esperado" (el cliente mandó algo mal / no tiene permiso) y
  // no vale la pena llenar los logs con eso.
  if (statusCode >= 500) {
    logger.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
