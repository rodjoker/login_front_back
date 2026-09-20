import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import * as userService from '../services/user.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  res.status(200).json(success({ users, count: users.length }, 'Usuarios obtenidos correctamente'));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(success({ user }, 'Usuario obtenido correctamente'));
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, req.user.id, req.user.role, req.body);
  res.status(200).json(success({ user }, 'Usuario actualizado correctamente'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUserById(req.params.id, req.user.id, req.user.role);
  res.status(200).json(success(null, 'Usuario eliminado correctamente'));
});
