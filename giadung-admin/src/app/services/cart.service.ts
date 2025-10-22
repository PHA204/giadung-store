// giadung-admin/src/app/services/cart.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  getAllCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  getCartByUserId(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`);
  }

  getCartItemById(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${id}`);
  }

  addToCart(cartItem: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, cartItem);
  }

  updateCartItem(id: number, cartItem: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, cartItem);
  }

  deleteCartItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  clearUserCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}`);
  }

  clearAllCarts(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}