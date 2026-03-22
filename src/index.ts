import 'dotenv/config';
import { buildApp } from './app.js';

const start = async () => {
  const app = await buildApp({ logger: true });
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';

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
