import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import { registerUser, loginUser } from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);
  res.status(201).json(success({ user, token }, 'Usuario registrado correctamente'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  res.status(200).json(success({ user, token }, 'Inicio de sesión exitoso'));
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(success({ user: req.user }, 'Perfil obtenido correctamente'));
});
