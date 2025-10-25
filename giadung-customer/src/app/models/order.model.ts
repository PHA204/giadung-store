import { User } from './user.model';
import { Product } from './product.model';

export interface Order {
  orderId?: number;
  user?: User;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  currentStatus: string;
  createdAt?: Date;
  orderDetails?: OrderDetail[];
}

export interface OrderDetail {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}