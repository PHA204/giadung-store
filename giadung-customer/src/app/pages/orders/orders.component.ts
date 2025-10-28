import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  currentUser: User | null = null;
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Filters
  selectedStatus: string = 'ALL';
  searchKeyword = '';

  // Status options
  statusOptions = [
    { value: 'ALL', label: 'Tất cả', icon: '📋' },
    { value: 'PENDING', label: 'Chờ xác nhận', icon: '⏳', color: '#f59e0b' },
    { value: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅', color: '#3b82f6' },
    { value: 'PROCESSING', label: 'Đang xử lý', icon: '⚙️', color: '#8b5cf6' },
    { value: 'SHIPPING', label: 'Đang giao', icon: '🚚', color: '#06b6d4' },
    { value: 'DELIVERED', label: 'Đã giao', icon: '📦', color: '#10b981' },
    { value: 'CANCELLED', label: 'Đã hủy', icon: '❌', color: '#ef4444' }
  ];

  ngOnInit(): void {
    this.loadCurrentUser();
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
        if (user?.userId) {
          this.loadOrders();
        }
      });
  }

  loadOrders(): void {
    if (!this.currentUser?.userId) return;

    this.loading = true;
    this.error = null;

    this.ordersService.getOrdersByUserId(this.currentUser.userId, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Handle both array response and paginated response
          if (Array.isArray(response)) {
            this.orders = response;
            this.totalItems = response.length;
            this.totalPages = 1;
          } else {
            this.orders = response.orders || response;
            this.totalItems = response.totalItems || this.orders.length;
            this.totalPages = response.totalPages || 1;
          }
          
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.error = 'Không thể tải danh sách đơn hàng';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(order => 
        order.currentStatus?.toUpperCase() === this.selectedStatus
      );
    }

    // Filter by search keyword
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId?.toString().includes(keyword) ||
        order.shippingAddress?.toLowerCase().includes(keyword)
      );
    }

    this.filteredOrders = filtered;
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  getStatusInfo(status: string) {
    return this.statusOptions.find(opt => opt.value === status?.toUpperCase()) || 
           { label: status, icon: '📋', color: '#6b7280' };
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

  getOrderItemCount(order: Order): number {
    return order.orderDetails?.reduce((sum, detail) => sum + detail.quantity, 0) || 0;
  }

  canCancelOrder(order: Order): boolean {
    return ['PENDING', 'CONFIRMED'].includes(order.currentStatus?.toUpperCase() || '');
  }

  cancelOrder(order: Order): void {
    if (!confirm(`Bạn có chắc muốn hủy đơn hàng #${order.orderId}?`)) {
      return;
    }

    this.ordersService.cancelOrder(order.orderId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Hủy đơn hàng thành công!');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Không thể hủy đơn hàng. Vui lòng thử lại.');
        }
      });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && !this.loading) {
      this.currentPage = page;
      this.loadOrders();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible);
    
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  trackByOrderId(index: number, order: Order): number {
    return order.orderId || index;
  }
}