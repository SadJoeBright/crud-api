import 'dotenv/config';
import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = Fastify({ logger: true });

const routesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'routes',
);

const start = async () => {
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';

  // Automatically register all Fastify plugins from `src/routes`.
  // Works with ESM because we resolve the directory from `import.meta.url`.
  app.register(AutoLoad, { dir: routesDir });

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
