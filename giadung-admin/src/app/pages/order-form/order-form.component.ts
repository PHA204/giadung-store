// giadung-admin/src/app/pages/order-form/order-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';
import { OrderRequest } from '../../models/order-request.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>Tạo Đơn Hàng Mới</h1>
        <button class="btn-back" routerLink="/orders">← Quay lại</button>
      </div>

      <div class="form-card">
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
          <!-- Thông tin khách hàng -->
          <div class="form-section">
            <h3>Thông Tin Khách Hàng</h3>
            
            <div class="form-group">
              <label for="userId">Khách Hàng <span class="required">*</span></label>
              <select id="userId" formControlName="userId" 
                      [class.invalid]="submitted && f['userId'].errors">
                <option value="">-- Chọn khách hàng --</option>
                <option *ngFor="let user of users" [value]="user.userId">
                  {{ user.fullName }} ({{ user.email }})
                </option>
              </select>
              <div class="error-message" *ngIf="submitted && f['userId'].errors">
                <small *ngIf="f['userId'].errors['required']">Vui lòng chọn khách hàng</small>
              </div>
            </div>

            <div class="form-group">
              <label for="shippingAddress">Địa Chỉ Giao Hàng <span class="required">*</span></label>
              <textarea id="shippingAddress" formControlName="shippingAddress" 
                        rows="3"
                        [class.invalid]="submitted && f['shippingAddress'].errors"
                        placeholder="Nhập địa chỉ giao hàng"></textarea>
              <div class="error-message" *ngIf="submitted && f['shippingAddress'].errors">
                <small *ngIf="f['shippingAddress'].errors['required']">Vui lòng nhập địa chỉ giao hàng</small>
              </div>
            </div>

            <div class="form-group">
              <label for="paymentMethod">Phương Thức Thanh Toán</label>
              <select id="paymentMethod" formControlName="paymentMethod">
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                <option value="CREDIT_CARD">Thẻ tín dụng</option>
              </select>
            </div>
          </div>

          <!-- Sản phẩm -->
          <div class="form-section">
            <div class="section-header">
              <h3>Sản Phẩm</h3>
              <button type="button" class="btn btn-secondary btn-sm" (click)="addProduct()">
                + Thêm Sản Phẩm
              </button>
            </div>

            <div formArrayName="items" class="products-list">
              <div *ngFor="let item of items.controls; let i = index" 
                   [formGroupName]="i" 
                   class="product-item">
                <div class="product-row">
                  <div class="form-group flex-2">
                    <label>Sản Phẩm <span class="required">*</span></label>
                    <select formControlName="productId" 
                            (change)="onProductChange(i)"
                            [class.invalid]="submitted && item.get('productId')?.errors">
                      <option value="">-- Chọn sản phẩm --</option>
                      <option *ngFor="let product of products" [value]="product.productId">
                        {{ product.productName }} - {{ formatPrice(product.price) }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Số Lượng <span class="required">*</span></label>
                    <input type="number" formControlName="quantity" 
                           min="1"
                           [class.invalid]="submitted && item.get('quantity')?.errors"
                           placeholder="1">
                  </div>

                  <div class="form-group">
                    <label>Đơn Giá</label>
                    <input type="number" formControlName="unitPrice" 
                           readonly
                           placeholder="0">
                  </div>

                  <div class="form-group">
                    <label>&nbsp;</label>
                    <button type="button" class="btn btn-danger btn-sm" 
                            (click)="removeProduct(i)"
                            [disabled]="items.length === 1">
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="no-products" *ngIf="items.length === 0">
              <p>Chưa có sản phẩm nào. Nhấn "Thêm Sản Phẩm" để bắt đầu.</p>
            </div>
          </div>

          <!-- Tổng tiền -->
          <div class="form-section total-section">
            <div class="total-row">
              <span class="total-label">Tổng Tiền:</span>
              <span class="total-amount">{{ formatPrice(calculateTotal()) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" 
                    (click)="onCancel()" 
                    [disabled]="loading">
              Hủy
            </button>
            <button type="submit" class="btn btn-primary" 
                    [disabled]="loading">
              <span *ngIf="!loading">Tạo Đơn Hàng</span>
              <span *ngIf="loading">Đang xử lý...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h1 {
      font-size: 1.875rem;
      color: #111827;
      margin: 0;
    }

    .btn-back {
      padding: 0.5rem 1rem;
      background-color: #f3f4f6;
      color: #374151;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 200ms;
      text-decoration: none;
    }

    .btn-back:hover {
      background-color: #e5e7eb;
    }

    .form-card {
      background-color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      font-size: 1.25rem;
      color: #111827;
      margin: 0 0 1.5rem 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      margin: 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .required {
      color: #ef4444;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 200ms;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    input.invalid, select.invalid, textarea.invalid {
      border-color: #ef4444;
    }

    .error-message {
      margin-top: 0.5rem;
    }

    .error-message small {
      color: #ef4444;
      font-size: 0.875rem;
    }

    .products-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .product-item {
      background-color: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .product-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    .flex-2 {
      grid-column: span 1;
    }

    .no-products {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      border: 2px dashed #d1d5db;
    }

    .total-section {
      background-color: #f9fafb;
      padding: 1.5rem !important;
      border-radius: 0.5rem;
      border: 2px solid #2563eb !important;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .total-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563eb;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1e40af;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #4b5563;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1rem;
      }

      .form-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .form-card {
        padding: 1.5rem;
      }

      .product-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ordersService = inject(OrdersService);
  private usersService = inject(UsersService);
  private productsService = inject(ProductsService);
  private router = inject(Router);

  orderForm!: FormGroup;
  users: User[] = [];
  products: Product[] = [];
  loading = false;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadProducts();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      userId: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      paymentMethod: ['COD'],
      items: this.fb.array([this.createProductItem()])
    });
  }

  createProductItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0]
    });
  }

  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => this.users = data.filter(u => u.role !== 'admin'),
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => this.products = data.filter(p => p.stockQuantity && p.stockQuantity > 0),
      error: (error) => console.error('Error loading products:', error)
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  get f() {
    return this.orderForm.controls;
  }

  addProduct(): void {
    this.items.push(this.createProductItem());
  }

  removeProduct(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onProductChange(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('productId')?.value;
    
    if (productId) {
      const product = this.products.find(p => p.productId === +productId);
      if (product) {
        item.patchValue({
          unitPrice: product.price
        });
      }
    }
  }

  calculateTotal(): number {
    let total = 0;
    this.items.controls.forEach(item => {
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      total += quantity * unitPrice;
    });
    return total;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.orderForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn tạo đơn hàng này?')) return;

    this.loading = true;

    const orderData: OrderRequest = {
      userId: +this.orderForm.value.userId,
      shippingAddress: this.orderForm.value.shippingAddress,
      paymentMethod: this.orderForm.value.paymentMethod,
      items: this.orderForm.value.items.map((item: any) => ({
        productId: +item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    this.ordersService.createOrder(orderData).subscribe({
      next: () => {
        alert('Tạo đơn hàng thành công!');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Lỗi khi tạo đơn hàng: ' + error.message);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    if (confirm('Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.')) {
      this.router.navigate(['/orders']);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}