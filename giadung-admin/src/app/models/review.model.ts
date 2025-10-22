// giadung-admin/src/app/models/review.model.ts
import { User } from './user.model';
import { Product } from './product.model';

export interface Review {
  reviewId?: number;
  user?: User;
  product?: Product;
  rating: number;
  comment?: string;
  createdAt?: Date;
}