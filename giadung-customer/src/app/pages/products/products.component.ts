import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { debounceTime, Subject, Subscription, catchError, of, finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:'./products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

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

  loading = false;
  isSearching = false;
  error: string | null = null;

  private priceCache = new Map<string, string>();

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    
    // Setup debounced search
    const searchSub = this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.searchProducts();
    });
    
    this.subscriptions.add(searchSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  trackByProduct(index: number, product: Product): number {
    return product.productId || index;
  }

  trackByCategory(index: number, category: Category): number {
    return category.categoryId || index;
  }

  onSearchChange(keyword: string): void {
    this.isSearching = true;
    this.searchSubject.next(keyword);
    this.cdr.markForCheck();
  }

  loadCategories(): void {
    const categoriesSub = this.categoriesService.getAllCategories()
      .pipe(
        catchError(err => {
          console.error('Error loading categories:', err);
          return of([]);
        })
      )
      .subscribe(data => {
        this.categories = data;
        this.cdr.markForCheck();
      });
    
    this.subscriptions.add(categoriesSub);
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    const [sortBy, direction] = this.sortOption.split('-');

    const productsSub = this.productsService.getAllProducts(this.currentPage, this.pageSize, sortBy, direction)
      .pipe(
        catchError(err => {
          console.error('Error loading products:', err);
          this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại.';
          return of({ products: [], totalItems: 0, totalPages: 0, currentPage: 0, pageSize: this.pageSize });
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(response => {
        this.products = this.filterProducts(response.products);
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
      });

    this.subscriptions.add(productsSub);
  }

  searchProducts(): void {
    if (!this.searchKeyword.trim()) {
      this.isSearching = false;
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    const searchSub = this.productsService.searchProducts(this.searchKeyword)
      .pipe(
        catchError(err => {
          console.error('Error searching products:', err);
          this.error = 'Lỗi khi tìm kiếm sản phẩm.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.isSearching = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(data => {
        this.products = this.filterProducts(data);
        this.totalItems = this.products.length;
        this.totalPages = 1;
        this.currentPage = 0;
      });

    this.subscriptions.add(searchSub);
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
    this.priceCache.clear();
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && !this.loading) {
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
    
    if (this.loading) return;
    
    this.cartService.addToCart(product, 1);
    this.showNotification(`✓ Đã thêm "${product.productName}" vào giỏ hàng`);
  }

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