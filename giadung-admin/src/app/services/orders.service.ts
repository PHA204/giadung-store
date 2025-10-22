// giadung-admin/src/app/services/orders.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Order } from '../models/order.model';
import { OrderRequest } from '../models/order-request.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  /**
   * Lấy tất cả đơn hàng
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Lấy đơn hàng theo ID
   */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Lấy đơn hàng theo user ID
   */
  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Lấy đơn hàng theo trạng thái
   */
  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Tạo đơn hàng mới
   */
  createOrder(order: Order | OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order)
      .pipe(catchError(this.handleError));
  }

  /**
   * Cập nhật đơn hàng
   */
  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order)
      .pipe(catchError(this.handleError));
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status?status=${status}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Xóa đơn hàng
   */
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Xử lý lỗi
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Có lỗi xảy ra!';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi client-side
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi server-side
      errorMessage = `Mã lỗi: ${error.status}\nThông báo: ${error.message}`;
      
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }
    
    console.error('OrdersService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}