import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  cartItems: CartItem[] = [];
  voucherCode = '';
  voucherError: string | null = null;
  showRemoveConfirm = false;
  itemToRemove: CartItem | null = null;
  isLoading = false;

  // Constants
  private readonly FREE_SHIPPING_THRESHOLD = 500000;
  private readonly SHIPPING_FEE = 30000;
  private readonly MIN_QUANTITY = 1;

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartItems(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.cartItems = items;
          this.validateCartItems();
        },
        error: (error) => {
          console.error('Error loading cart items:', error);
        }
      });
  }

  private validateCartItems(): void {
    // Validate quantities against stock
    this.cartItems.forEach(item => {
      if (item.quantity > item.product.stockQuantity) {
        item.quantity = item.product.stockQuantity;
        this.cartService.updateQuantity(item.product.productId!, item.quantity);
      }
    });
  }

  trackByProduct(index: number, item: CartItem): number {
    return item.product.productId ?? index;
  }

  // Price calculations
  calculateItemPrice(item: CartItem): number {
    const discount = item.product.discount ?? 0;
    return item.product.price * (1 - discount / 100);
  }

  calculateItemTotal(item: CartItem): number {
    return this.calculateItemPrice(item) * item.quantity;
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
  }

  getDiscount(): number {
    return this.cartItems.reduce((sum, item) => {
      const discount = item.product.discount ?? 0;
      const discountAmount = (item.product.price * discount / 100) * item.quantity;
      return sum + discountAmount;
    }, 0);
  }

  getShippingFee(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_FEE;
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscount() + this.getShippingFee();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getRemainingForFreeShipping(): number {
    const subtotal = this.getSubtotal();
    return Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  // Quantity management
  updateQuantity(item: CartItem): void {
    const productId = item.product.productId;
    if (!productId) {
      console.error('Product ID is missing');
      return;
    }

    // Validate quantity
    if (item.quantity < this.MIN_QUANTITY) {
      item.quantity = this.MIN_QUANTITY;
    }
    if (item.quantity > item.product.stockQuantity) {
      item.quantity = item.product.stockQuantity;
    }

    this.cartService.updateQuantity(productId, item.quantity);
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stockQuantity) {
      item.quantity++;
      this.updateQuantity(item);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > this.MIN_QUANTITY) {
      item.quantity--;
      this.updateQuantity(item);
    }
  }

  // Remove item
  removeItem(item: CartItem): void {
    this.itemToRemove = item;
    this.showRemoveConfirm = true;
  }

  confirmRemove(): void {
    if (this.itemToRemove?.product.productId) {
      this.cartService.removeFromCart(this.itemToRemove.product.productId);
    }
    this.closeRemoveModal();
  }

  cancelRemove(): void {
    this.closeRemoveModal();
  }

  private closeRemoveModal(): void {
    this.showRemoveConfirm = false;
    this.itemToRemove = null;
  }

  clearCart(): void {
    if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      this.cartService.clearCart();
    }
  }

  // Voucher
  applyVoucher(): void {
    const code = this.voucherCode.trim();
    
    if (!code) {
      this.voucherError = 'Vui lòng nhập mã giảm giá';
      return;
    }

    this.isLoading = true;
    this.voucherError = null;

    // TODO: Implement voucher validation with backend
    setTimeout(() => {
      this.voucherError = 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
      this.isLoading = false;
    }, 500);
  }

  // Checkout
  proceedToCheckout(): void {
    // Check if cart is empty
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }

    // Check stock availability
    const outOfStockItems = this.cartItems.filter(
      item => item.product.stockQuantity === 0
    );
    
    if (outOfStockItems.length > 0) {
      alert('Một số sản phẩm trong giỏ hàng đã hết hàng. Vui lòng xóa hoặc thay đổi sản phẩm.');
      return;
    }

    // Check authentication
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }

    // Navigate to checkout
    this.router.navigate(['/checkout']);
  }

  // Helper methods
  hasDiscount(item: CartItem): boolean {
    return (item.product.discount ?? 0) > 0;
  }

  isInStock(item: CartItem): boolean {
    return item.product.stockQuantity > 0;
  }

  canIncreaseQuantity(item: CartItem): boolean {
    return item.quantity < item.product.stockQuantity;
  }

  canDecreaseQuantity(item: CartItem): boolean {
    return item.quantity > this.MIN_QUANTITY;
  }

  isEligibleForFreeShipping(): boolean {
    return this.getSubtotal() >= this.FREE_SHIPPING_THRESHOLD;
  }
}