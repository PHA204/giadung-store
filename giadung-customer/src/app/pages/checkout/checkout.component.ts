import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderDetailRequest, OrderRequest, OrdersService } from '../../services/orders.service';
import { Order, OrderDetail } from '../../models/order.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  currentUser: User | null = null;
  isProcessing = false;
  orderSuccess = false;
  orderError: string | null = null;

  // Payment methods
  paymentMethods = [
    { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
    { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
    { value: 'CREDIT_CARD', label: 'Thẻ tín dụng/ghi nợ', icon: '💳' }
  ];

  private readonly FREE_SHIPPING_THRESHOLD = 500000;
  private readonly SHIPPING_FEE = 30000;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadCartItems();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.prefillUserData(user);
        }
      });
  }

  private loadCartItems(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        if (items.length === 0) {
          this.router.navigate(['/cart']);
        }
      });
  }

  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      paymentMethod: ['COD', Validators.required],
      notes: ['']
    });
  }

 private prefillUserData(user: User): void {
  if (this.checkoutForm) {  // Thêm check này
    this.checkoutForm.patchValue({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || ''
    });
  }
}

  // Price calculations
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  calculateItemPrice(item: CartItem): number {
    const discount = item.product.discount ?? 0;
    return item.product.price * (1 - discount / 100);
  }

  calculateItemTotal(item: CartItem): number {
    return this.calculateItemPrice(item) * item.quantity;
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Trường này là bắt buộc';
    if (field.errors['email']) return 'Email không hợp lệ';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Tối thiểu ${minLength} ký tự`;
    }
    if (field.errors['pattern']) return 'Số điện thoại không hợp lệ (10-11 số)';

    return '';
  }

  // Order submission
  async submitOrder(): Promise<void> {
  if (this.checkoutForm.invalid) {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
    return;
  }

  if (this.cartItems.length === 0) {
    this.orderError = 'Giỏ hàng trống';
    return;
  }

  // ← THÊM CHECK NÀY
  if (!this.currentUser || !this.currentUser.userId) {
    this.orderError = 'Vui lòng đăng nhập để đặt hàng';
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/checkout' }
    });
    return;
  }

  this.isProcessing = true;
  this.orderError = null;

  try {
    const orderRequest = this.createOrderFromForm();
    
    // Debug
    console.log('Order Request:', orderRequest);
    console.log('User ID:', this.currentUser.userId);
    
    this.ordersService.createOrder(orderRequest as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdOrder) => {
          console.log('Order created successfully:', createdOrder);
          this.handleOrderSuccess(createdOrder);
        },
        error: (error) => {
          console.error('Order creation error:', error);
          this.handleOrderError(error);
        }
      });
  } catch (error) {
    console.error('Submit error:', error);
    this.handleOrderError(error);
  }
}

 private createOrderFromForm(): any {
  const formValue = this.checkoutForm.value;
  const fullAddress = `${formValue.address}, ${formValue.ward}, ${formValue.district}, ${formValue.city}`;

  const orderDetails = this.cartItems
    .filter(item => item.product?.productId)
    .map(item => ({
      product: { productId: item.product.productId },  // ← Gửi object Product
      quantity: item.quantity,
      unitPrice: this.calculateItemPrice(item)
    }));

  return {
    user: { userId: this.currentUser!.userId },  // ← Gửi object User thay vì userId
    totalAmount: this.getTotal(),
    paymentMethod: formValue.paymentMethod,
    shippingAddress: fullAddress,
    currentStatus: 'PENDING',
    orderDetails: orderDetails
  };
}

  private handleOrderSuccess(order: Order): void {
    this.isProcessing = false;
    this.orderSuccess = true;
    
    // Clear cart
    this.cartService.clearCart();
    
    // Redirect to order confirmation page after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/orders', order.orderId]);
    }, 2000);
  }

  private handleOrderError(error: any): void {
    this.isProcessing = false;
    console.error('Order error:', error);
    
    if (error.error?.message) {
      this.orderError = error.error.message;
    } else {
      this.orderError = 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.';
    }
  }

  // Navigation
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}