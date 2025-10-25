import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ← OPTIMIZATION 1
  template: `
    <div class="products-container">
      <div class="products-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-section">
            <h3>Tìm kiếm</h3>
            <div class="search-box">
              <input 
                type="text" 
                [(ngModel)]="searchKeyword" 
                (ngModelChange)="onSearchChange($event)"
                placeholder="Tìm sản phẩm...">
              <button class="btn-search" (click)="searchProducts()">
                🔍
              </button>
            </div>
          </div>

          <div class="filter-section">
            <h3>Danh mục</h3>
            <div class="filter-options">
              <label class="filter-option">
                <input 
                  type="radio" 
                  name="category" 
                  [value]="null"
                  [(ngModel)]="selectedCategory"
                  (change)="applyFilters()">
                <span>Tất cả</span>
              </label>
              <label class="filter-option" *ngFor="let category of categories; trackBy: trackByCategory">
                <input 
                  type="radio" 
                  name="category" 
                  [value]="category.categoryId"
                  [(ngModel)]="selectedCategory"
                  (change)="applyFilters()">
                <span>{{ category.categoryName }}</span>
              </label>
            </div>
          </div>

          <div class="filter-section">
            <h3>Khoảng giá</h3>
            <div class="price-range">
              <input 
                type="number" 
                [(ngModel)]="minPrice" 
                placeholder="Từ"
                (change)="applyFilters()">
              <span>-</span>
              <input 
                type="number" 
                [(ngModel)]="maxPrice" 
                placeholder="Đến"
                (change)="applyFilters()">
            </div>
          </div>

          <div class="filter-section">
            <h3>Sắp xếp</h3>
            <select [(ngModel)]="sortOption" (change)="applySorting()" class="sort-select">
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="productName-asc">Tên A-Z</option>
              <option value="productName-desc">Tên Z-A</option>
            </select>
          </div>

          <button class="btn-reset" (click)="resetFilters()">
            Xóa bộ lọc
          </button>
        </aside>

        <!-- Products Grid -->
        <main class="products-main">
          <!-- Header -->
          <div class="products-header">
            <h2>
              {{ searchKeyword ? 'Kết quả tìm kiếm: ' + searchKeyword : 'Tất cả sản phẩm' }}
            </h2>
            <div class="products-count">
              Hiển thị {{ products.length }} / {{ totalItems }} sản phẩm
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="loading">
            <div class="spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error" class="error-message">
            <p>{{ error }}</p>
            <button class="btn" (click)="loadProducts()">Thử lại</button>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && products.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button class="btn btn-primary" (click)="resetFilters()">
              Xóa bộ lọc
            </button>
          </div>

          <!-- Products Grid with TrackBy -->
          <div class="products-grid" *ngIf="!loading && products.length > 0">
            <div *ngFor="let product of products; trackBy: trackByProduct" class="product-card">
              <a [routerLink]="['/products', product.productId]" class="product-link">
                <div class="product-image">
                  <!-- Lazy loading images -->
                  <img 
                    [src]="product.imageUrl || 'https://via.placeholder.com/300'" 
                    [alt]="product.productName"
                    loading="lazy">
                  <div class="product-badges">
                    <span class="badge badge-discount" *ngIf="product.discount && product.discount > 0">
                      -{{ product.discount }}%
                    </span>
                    <span class="badge badge-new" *ngIf="isNewProduct(product)">
                      Mới
                    </span>
                    <span class="badge badge-out" *ngIf="product.stockQuantity === 0">
                      Hết hàng
                    </span>
                  </div>
                </div>

                <div class="product-info">
                  <div class="product-category">
                    {{ product.category?.categoryName }}
                  </div>
                  <h3 class="product-name">{{ product.productName }}</h3>
                  <div class="product-brand">
                    {{ product.brand?.brandName }}
                  </div>

                  <div class="product-rating" *ngIf="product.ratingAvg">
                    <span class="stars">
                      {{ getStarDisplay(product.ratingAvg) }}
                    </span>
                    <span class="rating-value">{{ product.ratingAvg }}</span>
                  </div>

                  <div class="product-price">
                    <div class="price-wrapper">
                      <span class="current-price">
                        {{ formatPrice(calculateDiscountedPrice(product)) }}
                      </span>
                    </div>
                    <div class="original-price-wrapper" *ngIf="product.discount && product.discount > 0">
                      <span class="original-price">
                        {{ formatPrice(product.price) }}
                      </span>
                    </div>
                  </div>

                  <div class="product-stock">
                    <span [class.in-stock]="product.stockQuantity > 0" 
                          [class.out-stock]="product.stockQuantity === 0">
                      {{ product.stockQuantity > 0 ? 'Còn ' + product.stockQuantity + ' sản phẩm' : 'Hết hàng' }}
                    </span>
                  </div>
                </div>
              </a>

              <div class="product-actions">
                <button 
                  class="btn-add-cart" 
                  (click)="addToCart($event, product)"
                  [disabled]="product.stockQuantity === 0">
                  <span *ngIf="product.stockQuantity > 0">🛒 Thêm vào giỏ</span>
                  <span *ngIf="product.stockQuantity === 0">Hết hàng</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="!loading && totalPages > 1">
            <button 
              class="btn-page" 
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 0">
              ← Trước
            </button>

            <div class="page-numbers">
              <button 
                *ngFor="let page of getPageNumbers()" 
                class="btn-page-number"
                [class.active]="page === currentPage"
                (click)="goToPage(page)">
                {{ page + 1 }}
              </button>
            </div>

            <button 
              class="btn-page" 
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage === totalPages - 1">
              Sau →
            </button>
          </div>

          <!-- Page Size Selector -->
          <div class="page-size-selector" *ngIf="!loading && products.length > 0">
            <label>Hiển thị:</label>
            <select [(ngModel)]="pageSize" (change)="changePageSize()">
              <option [value]="12">12 sản phẩm</option>
              <option [value]="24">24 sản phẩm</option>
              <option [value]="48">48 sản phẩm</option>
            </select>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Copy all styles from previous version - they remain the same */
    .products-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .products-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }

    .filters-sidebar {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .filter-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .filter-section:last-child {
      border-bottom: none;
    }

    .filter-section h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .search-box {
      display: flex;
      gap: 0.5rem;
    }

    .search-box input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.95rem;
    }

    .btn-search {
      padding: 0.75rem 1rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-search:hover {
      background: #1e40af;
    }

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background 0.2s;
    }

    .filter-option:hover {
      background: #f3f4f6;
    }

    .filter-option input[type="radio"] {
      cursor: pointer;
    }

    .price-range {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 0.5rem;
    }

    .price-range input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.9rem;
      width: 100%;
    }

    .price-range span {
      color: #6b7280;
      font-weight: 500;
    }

    .sort-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      cursor: pointer;
    }

    .btn-reset {
      width: 100%;
      padding: 0.75rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-reset:hover {
      background: #dc2626;
    }

    .products-main {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .products-header h2 {
      font-size: 1.8rem;
      color: #333;
      margin: 0;
    }

    .products-count {
      color: #666;
      font-size: 0.95rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .product-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.12);
      border-color: #d1d5db;
    }

    .product-link {
      text-decoration: none;
      color: inherit;
    }

    .product-image {
      position: relative;
      width: 100%;
      height: 260px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .product-badges {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.3rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    .badge-discount {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .badge-new {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .badge-out {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: white;
    }

    .product-info {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 200px;
    }

    .product-category {
      font-size: 0.8rem;
      color: #2563eb;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-name {
      font-size: 1rem;
      margin: 0;
      color: #1f2937;
      font-weight: 600;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
      min-height: 2.8rem;
    }

    .product-brand {
      font-size: 0.85rem;
      color: #6b7280;
      font-weight: 500;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .stars {
      color: #f59e0b;
      font-size: 1rem;
    }

    .rating-value {
      font-size: 0.9rem;
      color: #666;
    }

    .product-price {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .current-price {
      font-size: 1.3rem;
      font-weight: bold;
      color: #ef4444;
      line-height: 1.2;
    }

    .original-price {
      font-size: 0.9rem;
      color: #9ca3af;
      text-decoration: line-through;
      line-height: 1.2;
    }

    .product-stock {
      font-size: 0.8rem;
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .in-stock {
      color: #059669;
      font-weight: 600;
    }

    .out-stock {
      color: #dc2626;
      font-weight: 600;
    }

    .product-actions {
      padding: 0 1rem 1rem;
    }

    .btn-add-cart {
      width: 100%;
      padding: 0.875rem 1rem;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }

    .btn-add-cart:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    }

    .btn-add-cart:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-add-cart:disabled {
      background: #d1d5db;
      cursor: not-allowed;
      box-shadow: none;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .btn-page, .btn-page-number {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-page:hover:not(:disabled), .btn-page-number:hover {
      background: #f3f4f6;
    }

    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-page-number.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }

    .page-size-selector {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .page-size-selector select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      background: #fee;
      border-radius: 0.5rem;
      color: #c00;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1e40af;
    }

    @media (max-width: 1024px) {
      .products-layout {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
      }

      .product-name {
        font-size: 0.95rem;
      }

      .current-price {
        font-size: 1.2rem;
      }

      .products-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private cartService = inject(CartService);
  
  // OPTIMIZATION 2: Debounce search
  private searchSubject = new Subject<string>();

  products: Product[] = [];
  categories: Category[] = [];
  
  currentPage = 0;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;

  searchKeyword = '';
  selectedCategory: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOption = 'createdAt-desc';

  loading = true;
  error: string | null = null;

  // OPTIMIZATION 3: Cache for formatted prices
  private priceCache = new Map<string, string>();

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    
    // OPTIMIZATION 2: Setup debounced search
    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after user stops typing
    ).subscribe(() => {
      this.searchProducts();
    });
  }

  // OPTIMIZATION 4: TrackBy functions for *ngFor
  trackByProduct(index: number, product: Product): number {
    return product.productId || index;
  }

  trackByCategory(index: number, category: Category): number {
    return category.categoryId || index;
  }

  // OPTIMIZATION 2: Debounced search
  onSearchChange(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const [sortBy, direction] = this.sortOption.split('-');

    this.productsService.getAllProducts(this.currentPage, this.pageSize, sortBy, direction).subscribe({
      next: (response) => {
        this.products = this.filterProducts(response.products);
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  searchProducts(): void {
    if (!this.searchKeyword.trim()) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.productsService.searchProducts(this.searchKeyword).subscribe({
      next: (data) => {
        this.products = this.filterProducts(data);
        this.totalItems = this.products.length;
        this.totalPages = 1;
        this.currentPage = 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Lỗi khi tìm kiếm sản phẩm.';
        this.loading = false;
        console.error('Error searching products:', err);
      }
    });
  }

  filterProducts(products: Product[]): Product[] {
    let filtered = [...products];

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category?.categoryId === this.selectedCategory);
    }

    if (this.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }

    return filtered;
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  applySorting(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.sortOption = 'createdAt-desc';
    this.currentPage = 0;
    this.priceCache.clear(); // Clear cache
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  changePageSize(): void {
    this.currentPage = 0;
    this.loadProducts();
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

  addToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.cartService.addToCart(product, 1);
    this.showNotification(`✓ Đã thêm "${product.productName}" vào giỏ hàng`);
  }

  // OPTIMIZATION 5: Reusable notification
  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  calculateDiscountedPrice(product: Product): number {
    if (!product.discount || product.discount === 0) {
      return product.price;
    }
    return product.price * (1 - product.discount / 100);
  }

  // OPTIMIZATION 3: Cached price formatting
  formatPrice(price: number): string {
    const key = price.toString();
    if (this.priceCache.has(key)) {
      return this.priceCache.get(key)!;
    }
    
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
    
    this.priceCache.set(key, formatted);
    return formatted;
  }

  isNewProduct(product: Product): boolean {
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreated <= 7;
  }

  getStarDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '⭐';
    return stars;
  }
}