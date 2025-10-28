import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly destroy$ = new Subject<void>();

  order: Order | null = null;
  loading = false;
  error: string | null = null;

  statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận', icon: '⏳', color: '#f59e0b' },
    { value: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅', color: '#3b82f6' },
    { value: 'PROCESSING', label: 'Đang xử lý', icon: '⚙️', color: '#8b5cf6' },
    { value: 'SHIPPING', label: 'Đang giao', icon: '🚚', color: '#06b6d4' },
    { value: 'DELIVERED', label: 'Đã giao', icon: '📦', color: '#10b981' },
    { value: 'CANCELLED', label: 'Đã hủy', icon: '❌', color: '#ef4444' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrderDetail(+id);
    } else {
      this.error = 'ID đơn hàng không hợp lệ';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrderDetail(id: number): void {
    this.loading = true;
    this.error = null;

    this.ordersService.getOrderById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading order:', error);
          this.error = 'Không thể tải thông tin đơn hàng';
          this.loading = false;
        }
      });
  }

  getStatusInfo(status: string) {
    return this.statusOptions.find(opt => opt.value === status?.toUpperCase()) || 
           { label: status, icon: '📋', color: '#6b7280' };
  }

  getCurrentStatusIndex(): number {
    const status = this.order?.currentStatus?.toUpperCase();
    return this.statusOptions.findIndex(opt => opt.value === status);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateSubtotal(): number {
    return this.order?.orderDetails?.reduce((sum, detail) => 
      sum + (detail.unitPrice * detail.quantity), 0
    ) || 0;
  }

  canCancelOrder(): boolean {
    return ['PENDING', 'CONFIRMED'].includes(this.order?.currentStatus?.toUpperCase() || '');
  }

  cancelOrder(): void {
    if (!this.order?.orderId) return;

    if (!confirm(`Bạn có chắc muốn hủy đơn hàng #${this.order.orderId}?`)) {
      return;
    }

    this.ordersService.cancelOrder(this.order.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Hủy đơn hàng thành công!');
          this.loadOrderDetail(this.order!.orderId!);
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Không thể hủy đơn hàng. Vui lòng thử lại.');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}