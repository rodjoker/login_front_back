import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../services/token.service.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No autorizado: falta el token de acceso', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token); // lanza AppError(401) si es inválido/expiró

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new AppError('El usuario de este token ya no existe', 401);
  }

  req.user = user;
  next();
});

// Uso: router.delete('/:id', protect, restrictTo('admin'), ...)
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('No tienes permiso para realizar esta acción', 403));
  }
  next();
};
