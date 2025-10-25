import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  public cartItems$ = this.cartItems.asObservable();

  constructor() {}

  private getCartFromStorage(): CartItem[] {
    const cartStr = localStorage.getItem('giadung_cart');
    return cartStr ? JSON.parse(cartStr) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('giadung_cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = this.getCartItems();
    const existingItem = items.find(item => item.product.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.saveCart(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = this.getCartItems();
    const item = items.find(i => i.product.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart(items);
      }
    }
  }

  removeFromCart(productId: number): void {
    const items = this.getCartItems().filter(item => item.product.productId !== productId);
    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartTotal(): number {
    return this.getCartItems().reduce((total, item) => {
      const price = item.product.price * (1 - (item.product.discount || 0) / 100);
      return total + (price * item.quantity);
    }, 0);
  }

  getCartCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.quantity, 0);
  }
}