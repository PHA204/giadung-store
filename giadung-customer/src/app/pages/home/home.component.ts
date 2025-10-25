import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Chào mừng đến Gia Dụng Store</h1>
          <p>Mua sắm sản phẩm gia dụng chất lượng cao với giá tốt nhất</p>
          <a routerLink="/products" class="btn btn-primary">Khám phá ngay</a>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <h2>Danh mục sản phẩm</h2>
        <div class="categories-grid">
          <div *ngFor="let category of categories" class="category-card">
            <img [src]="category.imageUrl || 'https://via.placeholder.com/200'" [alt]="category.categoryName">
            <h3>{{ category.categoryName }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="products-section">
        <div class="section-header">
          <h2>Sản phẩm nổi bật</h2>
          <a routerLink="/products" class="view-all">Xem tất cả →</a>
        </div>
        
        <div class="products-grid">
          <div *ngFor="let product of featuredProducts" class="product-card">
            <a [routerLink]="['/products', product.productId]">
              <img [src]="product.imageUrl || 'https://via.placeholder.com/300'" [alt]="product.productName">
              <div class="product-info">
                <h3>{{ product.productName }}</h3>
                <div class="product-meta">
                  <span class="category">{{ product.category?.categoryName }}</span>
                  <span class="brand">{{ product.brand?.brandName }}</span>
                </div>
                <div class="price-section">
                  <span class="price">{{ formatPrice(product.price) }}</span>
                  <span *ngIf="product.discount && product.discount > 0" class="discount">
                    -{{ product.discount }}%
                  </span>
                </div>
                <div class="rating" *ngIf="product.ratingAvg">
                  ⭐ {{ product.ratingAvg }}
                </div>
              </div>
            </a>
            <button 
              class="btn-add-cart" 
              (click)="addToCart(product)"
              [disabled]="product.stockQuantity === 0">
              {{ product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Đang tải...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-message">
        <p>{{ error }}</p>
        <button class="btn" (click)="loadData()">Thử lại</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      border-radius: 1rem;
      margin-bottom: 3rem;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .categories-section, .products-section {
      margin-bottom: 3rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #333;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .view-all {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .view-all:hover {
      color: #1e40af;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .category-card:hover {
      transform: translateY(-5px);
    }

    .category-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .category-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .category-card p {
      font-size: 0.9rem;
      color: #666;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-card a {
      text-decoration: none;
      color: inherit;
    }

    .product-card img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }

    .product-info {
      padding: 1rem;
    }

    .product-info h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .product-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .category, .brand {
      font-size: 0.85rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      background: #f3f4f6;
      color: #666;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2563eb;
    }

    .discount {
      background: #ef4444;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.85rem;
    }

    .rating {
      font-size: 0.9rem;
      color: #f59e0b;
    }

    .btn-add-cart {
      width: 100%;
      padding: 0.75rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0 0 0.5rem 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-add-cart:hover:not(:disabled) {
      background: #1e40af;
    }

    .btn-add-cart:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      background: #f3f4f6;
    }

    .loading {
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
      text-align: center;
      padding: 2rem;
      background: #fee;
      border-radius: 0.5rem;
      color: #c00;
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 1.8rem;
      }

      .products-grid, .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private cartService = inject(CartService);

  categories: Category[] = [];
  featuredProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.categoriesService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories:', err)
    });

    this.productsService.getAllProducts(0, 8, 'createdAt', 'desc').subscribe({
      next: (response) => {
        this.featuredProducts = response.products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải dữ liệu. Vui lòng thử lại.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}