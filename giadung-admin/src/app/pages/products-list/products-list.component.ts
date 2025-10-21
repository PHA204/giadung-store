// giadung-admin/src/app/pages/products-list/products-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="products-container">
      <div class="page-header">
        <h1>Quản Lý Sản Phẩm</h1>
        <button class="btn btn-primary" routerLink="/products/add">
          + Thêm Sản Phẩm
        </button>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="onSearch()"
          placeholder="Tìm kiếm sản phẩm..."
          class="search-input">
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="loading-container" *ngIf="loading">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div class="table-container" *ngIf="!loading && !errorMessage">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Sản Phẩm</th>
              <th>Giá</th>
              <th>Giảm Giá</th>
              <th>Tồn Kho</th>
              <th>Đánh Giá</th>
              <th>Ngày Tạo</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts">
              <td>{{ product.productId }}</td>
              <td>
                <div class="product-info">
                  <img *ngIf="product.imageUrl" [src]="product.imageUrl" 
                       alt="{{ product.productName }}" class="product-image">
                  <span>{{ product.productName }}</span>
                </div>
              </td>
              <td>{{ product.price | number:'1.0-0' }} ₫</td>
              <td>
                <span *ngIf="product.discount && product.discount > 0" 
                      class="badge badge-warning">
                  -{{ product.discount }}%
                </span>
                <span *ngIf="!product.discount || product.discount === 0">-</span>
              </td>
              <td>
                <span [class]="'badge ' + (product.stockQuantity > 0 ? 'badge-success' : 'badge-danger')">
                  {{ product.stockQuantity }}
                </span>
              </td>
              <td>
                <span class="rating">
                  ⭐ {{ product.ratingAvg || 0 }}
                </span>
              </td>
              <td>{{ product.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-edit" 
                    [routerLink]="['/products/edit', product.productId]"
                    title="Sửa">
                    ✏️
                  </button>
                  <button 
                    class="btn-delete" 
                    (click)="onDelete(product.productId!)"
                    title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="no-data" *ngIf="filteredProducts.length === 0">
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1400px;
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

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .error-message {
      padding: 1rem;
      background-color: #fee2e2;
      color: #991b1b;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
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

    .table-container {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background-color: #f3f4f6;
      border-bottom: 2px solid #e5e7eb;
    }

    .data-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
    }

    .data-table tbody tr {
      transition: background-color 200ms ease-in-out;
    }

    .data-table tbody tr:hover {
      background-color: #f9fafb;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .product-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 0.375rem;
    }

    .rating {
      color: #f59e0b;
      font-weight: 500;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }

    .badge-danger {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit,
    .btn-delete {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 200ms ease-in-out;
    }

    .btn-edit {
      background-color: #0ea5e9;
      color: white;
    }

    .btn-edit:hover {
      background-color: #0284c7;
      transform: translateY(-1px);
    }

    .btn-delete {
      background-color: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background-color: #dc2626;
      transform: translateY(-1px);
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms ease-in-out;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary:hover {
      background-color: #1e40af;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .search-input {
        max-width: 100%;
      }

      .data-table {
        font-size: 0.75rem;
      }

      .data-table th,
      .data-table td {
        padding: 0.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(product => 
      product.productName.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term))
    );
  }

  onDelete(productId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    this.productsService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Xóa sản phẩm thành công!');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        alert('Lỗi khi xóa sản phẩm!');
      }
    });
  }
}