// Envuelve un controller async para que cualquier rechazo de promesa caiga
// en next(error) automáticamente -- sin esto, cada controller necesitaría su
// propio try/catch repetido para no dejar una promesa rechazada sin manejar.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
