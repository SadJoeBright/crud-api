import { ProductDto } from '@types';

export const products: ProductDto[] = [];

/** Clears in-memory store (for tests). */
export function clearProducts(): void {
  products.length = 0;
}
