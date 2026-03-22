# crud-api

REST API for products (Fastify 5, TypeScript, Zod, in-memory storage). Routes are loaded with **`@fastify/autoload`** from `src/routes`.

## Requirements

- **Node.js** 20+ (LTS recommended)
- **npm** 9+

## Installation

```bash
git clone <repository-url>
cd crud-api
npm install
```

### Environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `4000`  | HTTP port |
| `HOST`   | `0.0.0.0` | Bind address |

## Running

| Script | Description |
|--------|-------------|
| `npm run start:dev` | **Development:** run TypeScript with **`tsx watch`** (restarts on file changes). |
| `npm run build` | Compile `src/` → **`dist/`** (`tsc` + **`tsc-alias`** for path aliases). |
| `npm run start:prod` | **Production:** `build`, then **`node dist/index.js`**. |
| `npm start` | Run **`dist/index.js`** only (use after `npm run build`). |
| `npm run typecheck` | Type-check without emitting files. |

**Development:**

```bash
npm run start:dev
```

Server listens on `http://127.0.0.1:<PORT>` (default `4000`).

**Production:**

```bash
npm run start:prod
```

## API

Base URL: `http://localhost:<PORT>` (replace `<PORT>` with your `PORT`, default `4000`).

### Health

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/health` | `{ "ok": true }` |

### Products

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get one product by UUID |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product (partial body allowed) |
| `DELETE` | `/api/products/:id` | Delete a product |

**Product JSON fields**

| Field | Type | Notes |
|-------|------|--------|
| `id` | string (UUID) | Set by server on create |
| `name` | string | Required, non-empty on create |
| `description` | string | |
| `price` | number | ≥ 0 |
| `category` | string | One of: `electronics`, `food`, `clothing`, `home`, `beauty`, `sports`, `toys`, `other` |
| `inStock` | boolean | |

### Example requests (`curl`)

```bash
# Health
curl -s http://127.0.0.1:4000/health

# List products
curl -s http://127.0.0.1:4000/api/products

# Create
curl -s -X POST http://127.0.0.1:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Phone","description":"Smartphone","price":999,"category":"electronics","inStock":true}'

# Get by id (replace UUID)
curl -s http://127.0.0.1:4000/api/products/<uuid>

# Update (partial)
curl -s -X PUT http://127.0.0.1:4000/api/products/<uuid> \
  -H "Content-Type: application/json" \
  -d '{"price":899}'

# Delete
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://127.0.0.1:4000/api/products/<uuid>
```

### HTTP status & errors

| Code | When |
|------|------|
| `200` | OK (GET list/single, PUT) |
| `201` | Created (`POST`) |
| `204` | No content (`DELETE` success) |
| `400` | Validation failed (Zod) — body `{ "error": "Validation failed", "details": … }` |
| `404` | Product not found — `{ "error": "Product not found" }` |
| `4xx` | Other client errors — `{ "error": "<message>" }` |
| `500` | Server error — `{ "error": "Internal server error" }` |

## Project notes

- **Path aliases** (see `tsconfig.json`): `@types`, `@data`, `@routes/*`, `@utils/*`. Production build uses **`tsc-alias`** so Node resolves imports in `dist/`.
- **Autoload:** do **not** add an empty `src/routes/index.ts` — if an index file exists in `routes/`, only that file is loaded and other route files are skipped.

## Troubleshooting

- **Stale server / wrong response:** stop the process (`Ctrl+C`) or free the port: `lsof -i :4000` then `kill <pid>`, then start again.
- **`EADDRINUSE`:** another process uses `PORT`; change `PORT` in `.env` or stop the other process.
