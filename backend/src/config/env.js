import dotenv from 'dotenv';

dotenv.config();

// MONGO_URI no es obligatoria en tests: la suite usa mongodb-memory-server
// (tests/setup.js) y nunca toca esta variable.
const required = ['JWT_SECRET'];
if (process.env.NODE_ENV !== 'test') {
  required.push('MONGO_URI');
}

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missing.join(', ')}. Revisa tu archivo .env (ver .env.example).`,
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || 3,
  lockTimeMinutes: Number(process.env.LOCK_TIME_MINUTES) || 15,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
