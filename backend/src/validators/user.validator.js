import { z } from 'zod';

// Update parcial a propósito (todo opcional): PATCH /api/users/:id no exige
// reenviar el objeto completo, solo lo que se quiere cambiar.
export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().trim().toLowerCase().email('El correo no tiene un formato válido'),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });
