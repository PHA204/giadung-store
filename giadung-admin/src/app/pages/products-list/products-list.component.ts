// giadung-admin/src/app/pages/products-list/products-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService, PagedResponse } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  
  products: Product[] = [];
  
  loading = false;
  searchTerm = '';
  errorMessage = '';
  
  // Server-side Pagination
  currentPage = 0;  // Backend starts from 0
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50, 100];
  
  // Sort options
  sortBy = 'createdAt';
  sortDirection = 'desc';
  
  // Search debounce
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearchDebounce();
  }

  /**
   * OPTIMIZED: Load products từ server với pagination
   */
  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.productsService.getProductsPaginated(
      this.currentPage, 
      this.pageSize, 
      this.sortBy, 
      this.sortDirection
    ).subscribe({
      next: (response: PagedResponse<Product>) => {
        this.products = response.products;
        this.currentPage = response.currentPage;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  /**
   * Setup debounce cho search (tránh spam API)
   */
  setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),  // Đợi 300ms sau khi user ngừng gõ
        distinctUntilChanged()  // Chỉ search nếu giá trị thay đổi
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  /**
   * Trigger search khi user gõ
   */
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  /**
   * Thực hiện search
   */
  performSearch(term: string): void {
    const trimmedTerm = term.trim();
    
    if (!trimmedTerm) {
      // Nếu search rỗng, load lại trang đầu
      this.currentPage = 0;
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.productsService.searchProducts(trimmedTerm).subscribe({
      next: (data) => {
        this.products = data;
        this.totalItems = data.length;
        this.totalPages = 1;
        this.currentPage = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.errorMessage = 'Lỗi khi tìm kiếm sản phẩm.';
        this.loading = false;
      }
    });
  }

  /**
   * Thay đổi trang
   */
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Thay đổi page size
   */
  onPageSizeChange(): void {
    this.currentPage = 0;  // Reset về trang đầu
    this.loadProducts();
  }

  /**
   * Thay đổi sort
   */
  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      // Toggle direction nếu click cùng column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDirection = 'desc';
    }
    this.currentPage = 0;
    this.loadProducts();
  }

  /**
   * Get page numbers để hiển thị
   */
  getPageNumbers(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);
      
      if (startPage > 0) {
        pages.push(0);
        if (startPage > 1) pages.push(-1); // Ellipsis
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < this.totalPages - 1) {
        if (endPage < this.totalPages - 2) pages.push(-1); // Ellipsis
        pages.push(this.totalPages - 1);
      }
    }
    
    return pages;
  }

  /**
   * Get display range
   */
  getDisplayRange(): string {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
    return `${start}-${end}`;
  }

  /**
   * Xóa sản phẩm
   */
  onDelete(productId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    this.productsService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Xóa sản phẩm thành công!');
        // Nếu trang hiện tại không còn item, quay về trang trước
        if (this.products.length === 1 && this.currentPage > 0) {
          this.currentPage--;
        }
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        alert('Lỗi khi xóa sản phẩm!');
      }
    });
  }

  /**
   * Format giá
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  /**
   * Get sort icon
   */
  getSortIcon(column: string): string {
    if (this.sortBy !== column) return '⇅';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}