// giadung-admin/src/app/models/order-request.model.ts
export interface OrderRequest {
  userId: number;
  paymentMethod?: string;
  shippingAddress: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice?: number;
}