import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { signToken } from './token.service.js';

// Mismo mensaje para "el usuario no existe" y "la contraseña está mal" --
// evita que alguien pueda usar el endpoint de login para averiguar qué
// correos están registrados en el sistema (enumeración de usuarios).
const INVALID_CREDENTIALS_MESSAGE = 'Credenciales inválidas';

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Ya existe una cuenta registrada con este correo', 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken({ sub: user._id.toString() });

  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS_MESSAGE, 401);
  }

  // Se chequea el bloqueo ANTES de tocar la contraseña -- una cuenta
  // bloqueada no debe filtrar (ni siquiera por timing) si la contraseña
  // mandada era o no correcta.
  if (user.isLocked) {
    throw new AppError(lockedMessage(user.lockUntil), 423);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= env.maxLoginAttempts) {
      user.lockUntil = new Date(Date.now() + env.lockTimeMinutes * 60_000);
      // Se resetea el contador al bloquear: el próximo ciclo de intentos
      // (una vez expire el bloqueo) arranca limpio en vez de seguir
      // sumando sobre un número que ya cumplió su propósito.
      user.loginAttempts = 0;
      await user.save();
      throw new AppError(lockedMessage(user.lockUntil), 423);
    }

    await user.save();
    throw new AppError(INVALID_CREDENTIALS_MESSAGE, 401);
  }

  // Login exitoso: limpiar cualquier rastro de intentos fallidos previos.
  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  const token = signToken({ sub: user._id.toString() });
  return { user, token };
}

function lockedMessage(lockUntil) {
  const remainingMs = lockUntil.getTime() - Date.now();
  const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
  return `Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta de nuevo en ${remainingMinutes} minuto(s).`;
}
