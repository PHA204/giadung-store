// giadung-admin/src/app/pages/order-detail/order-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="order-detail-container">
      <div class="page-header">
        <h1>Chi Tiết Đơn Hàng #{{ order?.orderId }}</h1>
        <button class="btn btn-secondary" routerLink="/orders">
          ← Quay lại
        </button>
      </div>

      <div class="loading-container" *ngIf="loading">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <div *ngIf="!loading && !errorMessage && order" class="order-content">
        <!-- Thông tin đơn hàng -->
        <div class="info-card">
          <h2>Thông Tin Đơn Hàng</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Mã Đơn Hàng:</span>
              <span class="info-value">#{{ order.orderId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ngày Đặt:</span>
              <span class="info-value">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Trạng Thái:</span>
              <span [class]="'badge ' + getStatusBadgeClass(order.currentStatus || 'pending')">
                {{ getStatusLabel(order.currentStatus || 'pending') }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Phương Thức Thanh Toán:</span>
              <span class="info-value">{{ order.paymentMethod || 'COD' }}</span>
            </div>
          </div>
        </div>

        <!-- Thông tin khách hàng -->
        <div class="info-card">
          <h2>Thông Tin Khách Hàng</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Họ Tên:</span>
              <span class="info-value">{{ order.user?.fullName || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ order.user?.email || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Số Điện Thoại:</span>
              <span class="info-value">{{ order.user?.phoneNumber || 'N/A' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Địa Chỉ Giao Hàng:</span>
              <span class="info-value">{{ order.shippingAddress }}</span>
            </div>
          </div>
        </div>

        <!-- Chi tiết sản phẩm -->
        <div class="info-card">
          <h2>Sản Phẩm</h2>
          <div class="products-table">
            <table>
              <thead>
                <tr>
                  <th>Sản Phẩm</th>
                  <th>Đơn Giá</th>
                  <th>Số Lượng</th>
                  <th>Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let detail of order.orderDetails">
                  <td>
                    <div class="product-info">
                      <img *ngIf="detail.product?.imageUrl" 
                           [src]="detail.product.imageUrl" 
                           [alt]="detail.product.productName"
                           class="product-image"
                           (error)="$any($event.target).src='https://via.placeholder.com/50'">
                      <span>{{ detail.product?.productName }}</span>
                    </div>
                  </td>
                  <td>{{ formatPrice(detail.unitPrice) }}</td>
                  <td>{{ detail.quantity }}</td>
                  <td class="subtotal">{{ formatPrice(detail.unitPrice * detail.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tổng cộng -->
        <div class="info-card total-card">
          <div class="total-row">
            <span class="total-label">Tổng Tiền:</span>
            <span class="total-amount">{{ formatPrice(order.totalAmount) }}</span>
          </div>
        </div>

        <!-- Cập nhật trạng thái -->
        <div class="info-card">
          <h2>Cập Nhật Trạng Thái</h2>
          <div class="status-update">
            <select [(ngModel)]="selectedStatus" class="status-select">
              <option *ngFor="let status of statusOptions" [value]="status.value">
                {{ status.label }}
              </option>
            </select>
            <button class="btn btn-primary" (click)="updateStatus()" [disabled]="updating">
              <span *ngIf="!updating">Cập Nhật</span>
              <span *ngIf="updating">Đang xử lý...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 1.875rem;
      color: #111827;
      margin: 0;
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      padding: 1rem;
      background-color: #fee2e2;
      color: #991b1b;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .order-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .info-card h2 {
      font-size: 1.25rem;
      color: #111827;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .info-value {
      font-size: 1rem;
      color: #111827;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      width: fit-content;
    }

    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge-info {
      background-color: #cffafe;
      color: #164e63;
    }

    .badge-primary {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }

    .badge-danger {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .products-table {
      overflow-x: auto;
    }

    .products-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table thead {
      background-color: #f3f4f6;
    }

    .products-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .products-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .subtotal {
      font-weight: 600;
      color: #059669;
    }

    .total-card {
      background-color: #f9fafb;
      border: 2px solid #2563eb;
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

    .status-update {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .status-select {
      flex: 1;
      max-width: 300px;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
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

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .order-detail-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .status-update {
        flex-direction: column;
        align-items: stretch;
      }

      .status-select {
        max-width: 100%;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order: Order | null = null;
  loading = false;
  updating = false;
  errorMessage = '';
  selectedStatus = '';

  statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã gửi hàng' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadOrder(id);
      }
    });
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.selectedStatus = order.currentStatus || 'pending';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.errorMessage = 'Lỗi khi tải thông tin đơn hàng. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  updateStatus(): void {
    if (!this.order || !this.order.orderId) return;

    if (!confirm('Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?')) return;

    this.updating = true;

    this.ordersService.updateOrderStatus(this.order.orderId, this.selectedStatus).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        alert('Cập nhật trạng thái thành công!');
        this.updating = false;
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Lỗi khi cập nhật trạng thái!');
        this.updating = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'badge-warning',
      'processing': 'badge-info',
      'shipped': 'badge-primary',
      'delivered': 'badge-success',
      'cancelled': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}