import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Order, OrderDetail } from '../models/order.model';

export interface OrderRequest {
  userId?: number;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  notes?: string;
  orderDetails: OrderDetailRequest[];
}

export interface OrderDetailRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrdersResponse {
  orders: Order[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  /**
   * Get all orders with pagination
   */
  getAllOrders(
    page: number = 0, 
    size: number = 10, 
    sortBy: string = 'createdAt', 
    direction: string = 'desc'
  ): Observable<OrdersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<OrdersResponse>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get order by ID
   */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get orders by user ID
   */
  getOrdersByUserId(
    userId: number, 
    page: number = 0, 
    size: number = 10
  ): Observable<OrdersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<OrdersResponse>(`${this.apiUrl}/user/${userId}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(
    status: string, 
    page: number = 0, 
    size: number = 10
  ): Observable<OrdersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<OrdersResponse>(`${this.apiUrl}/status/${status}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create new order
   */
  createOrder(order: Order): Observable<Order> {
    const orderRequest = this.mapOrderToRequest(order);
    
    return this.http.post<Order>(this.apiUrl, orderRequest)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update order
   */
  updateOrder(id: number, order: Order): Observable<Order> {
    const orderRequest = this.mapOrderToRequest(order);
    
    return this.http.put<Order>(`${this.apiUrl}/${id}`, orderRequest)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update order status
   */
  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${id}/status`, 
      null,
      { params: new HttpParams().set('status', status) }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cancel order
   */
  cancelOrder(id: number): Observable<Order> {
    return this.updateOrderStatus(id, 'CANCELLED');
  }

  /**
   * Delete order
   */
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get order statistics (for admin)
   */
  getOrderStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Map Order model to OrderRequest for API
   */
  private mapOrderToRequest(order: Order): any {
  const orderDetails = (order.orderDetails || [])
    .filter(detail => detail.product?.productId)
    .map(detail => ({
      product: {
        productId: detail.product.productId!
      },
      quantity: detail.quantity,
      unitPrice: detail.unitPrice
    }));

  return {
    user: {
      userId: order.user?.userId
    },
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress,
    currentStatus: order.currentStatus?.toLowerCase() || 'pending',
    orderDetails: orderDetails
  };
}

  /**
   * Error handling
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 404) {
        errorMessage = 'Không tìm thấy đơn hàng';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Dữ liệu không hợp lệ';
      } else if (error.status === 401) {
        errorMessage = 'Vui lòng đăng nhập để tiếp tục';
      } else if (error.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này';
      } else if (error.status === 500) {
        errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau';
      } else {
        errorMessage = error.error?.message || errorMessage;
      }
    }

    console.error('Order Service Error:', error);
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      error: error.error
    }));
  }

  /**
   * Helper: Get order status label in Vietnamese
   */
  getOrderStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'PROCESSING': 'Đang xử lý',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'RETURNED': 'Đã trả hàng'
    };
    return statusMap[status] || status;
  }

  /**
   * Helper: Get order status color
   */
  getOrderStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'CONFIRMED': '#3b82f6',
      'PROCESSING': '#8b5cf6',
      'SHIPPING': '#06b6d4',
      'DELIVERED': '#10b981',
      'COMPLETED': '#059669',
      'CANCELLED': '#ef4444',
      'RETURNED': '#f97316'
    };
    return colorMap[status] || '#6b7280';
  }

  /**
   * Helper: Check if order can be cancelled
   */
  canCancelOrder(status: string): boolean {
    return ['PENDING', 'CONFIRMED'].includes(status);
  }

  /**
   * Helper: Calculate order total from details
   */
  calculateOrderTotal(orderDetails: OrderDetail[]): number {
    return orderDetails.reduce((sum, detail) => {
      return sum + (detail.unitPrice * detail.quantity);
    }, 0);
  }
}