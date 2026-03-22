import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@types': path.join(root, 'src/types/index.ts'),
      '@data': path.join(root, 'src/data/index.ts'),
      '@routes': path.join(root, 'src/routes'),
      '@utils': path.join(root, 'src/utils'),
    },
  },
});
