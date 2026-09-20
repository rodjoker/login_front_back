// Error "operacional": uno que anticipamos y sabemos comunicar al cliente
// con un status code y un mensaje claros (a diferencia de un bug real, que
// cae al branch por defecto de error.middleware.js con status 500).
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
