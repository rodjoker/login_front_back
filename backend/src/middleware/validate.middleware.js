import { AppError } from '../utils/AppError.js';

// Valida req.body contra un schema de zod. En éxito, reemplaza req.body por
// la versión "parseada" (con los .trim()/.toLowerCase() ya aplicados) para
// que el controller reciba datos ya normalizados.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join(' | ');
    return next(new AppError(message, 400));
  }

  req.body = result.data;
  next();
};
