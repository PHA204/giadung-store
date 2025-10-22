// giadung-admin/src/app/models/order.model.ts
import { User } from './user.model';
import { OrderDetail } from './order-detail.model';

export interface Order {
  orderId?: number;
  user?: User;
  totalAmount: number;
  paymentMethod?: string;
  shippingAddress: string;
  currentStatus?: string;
  createdAt?: Date;
  orderDetails?: OrderDetail[];
}