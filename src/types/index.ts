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

export type ProductDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
};

export type CreateProductReqDto = Omit<ProductDto, 'id'>;

export type UpdateProductReqDto = Partial<ProductDto>;
