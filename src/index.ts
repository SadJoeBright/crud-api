import 'dotenv/config';
import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = Fastify({ logger: true });

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

const start = async () => {
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';

  await app.register(AutoLoad, { dir: routesDir });

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
