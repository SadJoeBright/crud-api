import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { products } from '@data';
import {
  ProductDto,
  createProductSchema,
  notFoundErrorSchema,
  productDtoSchema,
  productIdParamsSchema,
  updateProductSchema,
} from '@types';

const productsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/products',
    {
      schema: {
        response: {
          200: z.array(productDtoSchema),
        },
      },
    },
    async (_request, reply) => {
      return reply.status(200).send(products);
    },
  );

  app.get(
    '/api/products/:id',
    {
      schema: {
        params: productIdParamsSchema,
        response: {
          200: productDtoSchema,
          404: notFoundErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const product = products.find((p) => p.id === id);

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      return reply.status(200).send(product);
    },
  );

  app.post(
    '/api/products',
    {
      schema: {
        body: createProductSchema,
        response: {
          201: productDtoSchema,
        },
      },
    },
    async (request, reply) => {
      const product: ProductDto = {
        id: randomUUID(),
        ...request.body,
      };
      products.push(product);

      return reply.status(201).send(product);
    },
  );

  app.put(
    '/api/products/:id',
    {
      schema: {
        params: productIdParamsSchema,
        body: updateProductSchema,
        response: {
          200: productDtoSchema,
          404: notFoundErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      const product = products[index];
      const { id: existingId, ...productFields } = product;

      const updatedProduct: ProductDto = {
        id: existingId,
        ...productFields,
        ...request.body,
      };

      products[index] = updatedProduct;

      return reply.status(200).send(updatedProduct);
    },
  );

  app.delete(
    '/api/products/:id',
    {
      schema: {
        params: productIdParamsSchema,
        response: {
          204: z.undefined(),
          404: notFoundErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      products.splice(index, 1);

      return reply.status(204).send(undefined);
    },
  );
};

export default productsRoutes;
