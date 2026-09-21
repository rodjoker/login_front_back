import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { globalLimiter} from './middleware/rateLimiter.middleware.js';

// Nunca llama a app.listen() acá -- eso es responsabilidad de server.js.
// Separarlos es lo que permite que Supertest (tests/integration/*) importe
// este mismo app y le mande requests en memoria, sin levantar un puerto real.
const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// El rate limiting queda fuera durante los tests: la suite de bloqueo de
// cuenta manda varios logins fallidos seguidos a propósito, y no debe
// chocar con un límite pensado para tráfico real.
if (env.nodeEnv !== 'test') {
  app.use('/api', globalLimiter);
}

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Servidor operativo', uptime: process.uptime() });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
