import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Solo se usa para el servidor real (server.js). Los tests conectan por su
// cuenta a mongodb-memory-server en tests/setup.js -- este archivo nunca se
// importa desde ahí, así que nunca compite por la misma conexión.
export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB conectado correctamente');
  } catch (error) {
    logger.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
