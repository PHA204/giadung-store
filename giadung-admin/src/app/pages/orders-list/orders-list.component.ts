// giadung-admin/src/app/pages/orders-list/orders-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit {
  private ordersService = inject(OrdersService);
  
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  
  loading = false;
  searchTerm = '';
  errorMessage = '';
  selectedStatus = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  // Status options
  statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },  // ← Thêm nếu cần
  { value: 'shipped', label: 'Đã gửi hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'cancelled', label: 'Đã hủy' },
];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.ordersService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.currentStatus === this.selectedStatus);
    }

    // Filter by search term
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(order =>
        order.orderId?.toString().includes(term) ||
        order.user?.fullName?.toLowerCase().includes(term) ||
        order.shippingAddress?.toLowerCase().includes(term)
      );
    }

    this.filteredOrders = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push(-1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) pages.push(-1);
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
    return `${start}-${end}`;
  }

  getStatusBadgeClass(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': 'badge-warning',
    'processing': 'badge-info',
    'confirmed': 'badge-info',     // ← Thêm
    'shipped': 'badge-primary',
    'delivered': 'badge-success',
    'cancelled': 'badge-danger',    
  };
  return statusMap[status?.toLowerCase()] || 'badge-secondary';
}

  getStatusLabel(status: string): string {
  // Mapping trạng thái từ DB sang label tiếng Việt
  const statusMap: { [key: string]: string } = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  };
  
  return statusMap[status.toLowerCase()] || status; // Trả về giá trị DB nếu không tìm thấy mapping
}

  onUpdateStatus(orderId: number, newStatus: string): void {
    this.ordersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        alert('Cập nhật trạng thái đơn hàng thành công!');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Lỗi khi cập nhật trạng thái đơn hàng!');
      }
    });
  }

  onDelete(orderId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      return;
    }

    this.ordersService.deleteOrder(orderId).subscribe({
      next: () => {
        alert('Xóa đơn hàng thành công!');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error deleting order:', error);
        alert('Lỗi khi xóa đơn hàng!');
      }
    });
  }
}