// Variables de entorno para la suite de tests -- se fijan ANTES de cualquier
// import de la app: src/config/env.js valida process.env en el momento en
// que se importa, así que si esto corriera después ya sería tarde. Vitest
// garantiza que setupFiles termina de evaluarse antes de que el archivo de
// test (que sí importa src/app.js) empiece a correr sus propios imports.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-solo-para-la-suite-de-tests-nunca-usar-en-produccion';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MAX_LOGIN_ATTEMPTS = '3';
process.env.LOCK_TIME_MINUTES = '15';
process.env.BCRYPT_SALT_ROUNDS = '4'; // rounds bajos: bcrypt real, pero rápido para no volver la suite lenta

import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

// Limpia todas las colecciones entre tests -- cada test arranca con la base
// vacía, sin depender del orden en que corran ni de qué dejó el anterior.
afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
