import { randomUUID } from 'node:crypto';
import { FastifyPluginAsync } from 'fastify';
import { products } from '../data/index.js';
import {
  CreateProductReqDto,
  ProductDto,
  UpdateProductReqDto,
} from '../types/index.js';

const productsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/products', async (request, response) => {
    return response.status(200).send(products);
  });

  app.get('/api/products/:id', async (request, response) => {
    const { id } = request.params as { id: string };
    const product = products.find((product) => product.id === id);

    if (!product) {
      return response.status(404).send({ error: 'Product not found' });
    }

    return response.status(200).send(product);
  });

  app.post('/api/products', async (request, response) => {
    const body = request.body as CreateProductReqDto;

    const product: ProductDto = {
      id: randomUUID(),
      ...body,
    };
    products.push(product);

    return response.status(201).send(product);
  });

  app.put('/api/products/:id', async (request, response) => {
    const { id } = request.params as { id: string };
    const body = request.body as UpdateProductReqDto;

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return response.status(404).send({ error: 'Product not found' });
    }

    const product = products[index];

    const updatedProduct: ProductDto = {
      ...product,
      ...body,
      id: product.id,
    };

    products[index] = updatedProduct;

    return response.status(200).send(updatedProduct);
  });

  app.delete('/api/products/:id', async (request, response) => {
    const { id } = request.params as { id: string };
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return response.status(404).send({ error: 'Product not found' });
    }

    products.splice(index, 1);

    return response.status(204).send();
  });
};

export default productsRoutes;
