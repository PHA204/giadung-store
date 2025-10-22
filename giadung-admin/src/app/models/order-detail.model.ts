// giadung-admin/src/app/models/order-detail.model.ts
import { Product } from './product.model';

export interface OrderDetail {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}