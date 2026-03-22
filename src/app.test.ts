import type { FastifyInstance } from 'fastify';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { buildApp } from './app.js';
import { clearProducts } from './data/index.js';

const validProduct = {
  name: 'Phone',
  description: 'Smart',
  price: 99,
  category: 'electronics' as const,
  inStock: true,
};

describe('Products API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({ routes: 'static' });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    clearProducts();
  });

  it('GET /api/products — empty array', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/products' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([]);
  });

  it('POST /api/products — response contains the newly created record', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { 'content-type': 'application/json' },
      payload: validProduct,
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body) as Record<string, unknown>;
    expect(body).toMatchObject({
      ...validProduct,
      id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      ),
    });
  });

  it('GET /api/products/{productId} — returns the created record by id', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/products',
      headers: { 'content-type': 'application/json' },
      payload: validProduct,
    });
    const { id } = JSON.parse(created.body) as { id: string };

    const res = await app.inject({
      method: 'GET',
      url: `/api/products/${id}`,
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({
      id,
      name: validProduct.name,
      price: validProduct.price,
      category: validProduct.category,
      inStock: validProduct.inStock,
      description: validProduct.description,
    });
  });
});
