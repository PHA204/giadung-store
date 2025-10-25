import { Brand } from './brand.model';
import { Category } from './category.model';

export interface Product {
  productId?: number;
  productName: string;
  description?: string;
  price: number;
  discount?: number;
  stockQuantity: number;
  imageUrl?: string;
  ratingAvg?: number;
  category?: Category;
  brand?: Brand;
  createdAt?: Date;
  updatedAt?: Date;
}