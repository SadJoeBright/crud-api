import { FastifyPluginAsync } from 'fastify';
import { products } from '../data/index.js';
import { ProductDto } from '../types/index.js';

const productsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/products', async (request, response) => {
    return response.status(200).send(products);
  });

  app.post('/api/products', async (request, response) => {
    const product = request.body as ProductDto;
    products.push(product);
    return response.status(201).send(product);
  });
};

export default productsRoutes;
