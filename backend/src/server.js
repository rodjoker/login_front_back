import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`Servidor escuchando en el puerto ${env.port} (entorno: ${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} recibido, cerrando servidor...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});
