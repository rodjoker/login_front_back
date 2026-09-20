import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    testTimeout: 20000, // mongodb-memory-server puede tardar en la primera descarga del binario
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'tests/**',
        'src/server.js',
        'src/config/db.js',
        'vitest.config.js',
        'node_modules/**',
      ],
    },
  },
});
