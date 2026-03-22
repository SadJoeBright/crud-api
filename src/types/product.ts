import { z } from 'zod';
import { INVALID_PRODUCT_ID_MESSAGE } from '@utils/productId.js';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  FOOD = 'food',
  CLOTHING = 'clothing',
  HOME = 'home',
  BEAUTY = 'beauty',
  SPORTS = 'sports',
  TOYS = 'toys',
  OTHER = 'other',
}

const productBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  price: z.number().nonnegative('Price can not be negative'),
  category: z.enum(ProductCategory),
  inStock: z.boolean(),
});

export const createProductSchema = productBodySchema.strict();

export const updateProductSchema = productBodySchema.partial().strict();

export const productDtoSchema = z
  .object({
    id: z.uuid(),
  })
  .extend(productBodySchema.shape)
  .strict();

export const productIdParamsSchema = z
  .object({
    id: z.uuid({ message: INVALID_PRODUCT_ID_MESSAGE }),
  })
  .strict();

export const notFoundErrorSchema = z.object({
  error: z.string(),
});

export type ProductDto = z.infer<typeof productDtoSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
