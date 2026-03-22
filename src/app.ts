import Fastify, { type FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import healthRoutes from './routes/health.js';
import productsRoutes from './routes/products.js';

export type BuildAppOptions = {
  /** Default: `false` (quieter tests). */
  logger?: boolean;
  /**
   * `autoload` — load plugins from `src/routes` (production / dev server).
   * `static` — register route modules directly (used in Vitest so path aliases resolve).
   */
  routes?: 'autoload' | 'static';
};

export async function buildApp(
  options?: BuildAppOptions,
): Promise<FastifyInstance> {
  const app = Fastify({ logger: options?.logger ?? false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: error.validation,
      });
    }

    const err = error as Error & { statusCode?: number };
    const statusCode =
      typeof err.statusCode === 'number' && err.statusCode >= 400
        ? err.statusCode
        : 500;

    if (statusCode >= 500) {
      request.log.error({ err });
      return reply.status(500).send({ error: 'Internal server error' });
    }

    return reply.status(statusCode).send({
      error: err.message || 'Request failed',
    });
  });

  const routesDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'routes',
  );

  const routeMode = options?.routes ?? 'autoload';
  if (routeMode === 'static') {
    await app.register(healthRoutes);
    await app.register(productsRoutes);
  } else {
    await app.register(AutoLoad, { dir: routesDir });
  }

  return app;
}
