import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';

export async function listUsers() {
  return User.find();
}

export async function getUserById(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError('Usuario no encontrado', 404);
  return user;
}

// requesterId/requesterRole vienen del token (req.user), nunca del body --
// así un usuario no puede editar/borrar a otro solo por adivinar su :id.
function assertOwnerOrAdmin(targetId, requesterId, requesterRole) {
  if (String(targetId) !== String(requesterId) && requesterRole !== 'admin') {
    throw new AppError('No tienes permiso para realizar esta acción sobre este usuario', 403);
  }
}

export async function updateUserById(id, requesterId, requesterRole, data) {
  assertOwnerOrAdmin(id, requesterId, requesterRole);

  // Estos campos tienen sus propios flujos dedicados (o directamente no
  // deberían poder cambiarse desde acá) -- se descartan aunque vengan en el
  // body, en vez de confiar en que el cliente nunca los mande.
  const { password, role, loginAttempts, lockUntil, ...safeData } = data;

  const user = await User.findByIdAndUpdate(id, safeData, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!user) throw new AppError('Usuario no encontrado', 404);
  return user;
}

export async function deleteUserById(id, requesterId, requesterRole) {
  assertOwnerOrAdmin(id, requesterId, requesterRole);

  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError('Usuario no encontrado', 404);
  return user;
}
