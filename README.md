# crud-api

## Development

```bash
npm run start:dev
```

### Errors

Unhandled failures during a request are caught by the global error handler (`src/errorHandler.ts`):

- **500** — JSON `{ "error": "<message>" }` with a generic message in **`NODE_ENV=production`** (details stay in server logs). In development, the thrown message is returned to help debugging.
- **4xx** (Fastify operational errors) — JSON `{ "error": "<message>" }` with the error’s message when safe.
- **400** (Zod / schema validation) — `{ "error": "Validation failed", "details": … }` as before.

### POST `/api/products` returns no `id`

If the response looks like the request body only (no `id` field), you are usually hitting an **old Node process** still listening on the same port (for example `4000`) with outdated code.

1. Stop the server in the terminal where it runs (**Ctrl+C**), or free the port:

   ```bash
   lsof -i :4000
   kill <PID>
   ```

2. Start again: `npm run start:dev`

3. Confirm you call the same host/port as the server (check `PORT` in `.env`).
