// Forma estándar de respuesta exitosa en toda la API -- mantiene el mismo
// contrato { success, message, data } que ya usa error.middleware.js para
// las respuestas de error, así el cliente nunca tiene que adivinar la forma.
export const success = (data = null, message = 'OK') => ({
  success: true,
  message,
  data,
});
