// Logger mínimo, sin dependencias -- suficiente para un boilerplate. Si el
// proyecto crece, es un punto de reemplazo directo por pino/winston sin
// tocar los call-sites (todos usan logger.info/warn/error/debug).
const COLORS = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[90m',
};
const RESET = '\x1b[0m';

function log(level, ...args) {
  // En tests no queremos ruido de info/warn/debug -- los errores reales sí
  // se siguen mostrando, ayudan a diagnosticar un test que falla.
  if (process.env.NODE_ENV === 'test' && level !== 'error') return;

  const timestamp = new Date().toISOString();
  const prefix = `${COLORS[level] ?? ''}[${timestamp}] [${level.toUpperCase()}]${RESET}`;
  const method = level === 'debug' ? 'log' : level;
  console[method](prefix, ...args);
}

export const logger = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  debug: (...args) => log('debug', ...args),
};
