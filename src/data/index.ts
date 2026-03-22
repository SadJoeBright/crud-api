import { ProductCategory, ProductDto } from '../types/index.js';

export const products: ProductDto[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    category: ProductCategory.ELECTRONICS,
    inStock: true,
  },
];
