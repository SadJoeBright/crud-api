# crud-api

## Development

```bash
npm run start:dev
```

### POST `/api/products` returns no `id`

If the response looks like the request body only (no `id` field), you are usually hitting an **old Node process** still listening on the same port (for example `4000`) with outdated code.

1. Stop the server in the terminal where it runs (**Ctrl+C**), or free the port:

   ```bash
   lsof -i :4000
   kill <PID>
   ```

2. Start again: `npm run start:dev`

3. Confirm you call the same host/port as the server (check `PORT` in `.env`).
