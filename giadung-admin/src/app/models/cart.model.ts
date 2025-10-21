import { User } from '../models/user.model';
import { Product } from '../models/product.model';

export interface CartItem {
  cartItemId?: number;
  user: User;
  product: Product;
  quantity: number;
  addedAt?: Date;
}