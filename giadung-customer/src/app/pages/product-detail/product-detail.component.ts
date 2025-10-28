import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  product: Product | null = null;
  quantity: number = 1;
  loading = true;
  error: string | null = null;
  addingToCart = false;
  showSuccessToast = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.error = 'ID sản phẩm không hợp lệ';
      this.loading = false;
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Không thể tải thông tin sản phẩm';
        this.loading = false;
      }
    });
  }

  calculateDiscountedPrice(): number {
    if (!this.product) return 0;
    if (!this.product.discount || this.product.discount === 0) {
      return this.product.price;
    }
    return this.product.price * (1 - this.product.discount / 100);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  isNewProduct(): boolean {
    if (!this.product?.createdAt) return false;
    const createdDate = new Date(this.product.createdAt);
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

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.addingToCart = true;
    
    setTimeout(() => {
      this.cartService.addToCart(this.product!, this.quantity);
      this.addingToCart = false;
      this.showSuccessToast = true;
      
      setTimeout(() => {
        this.showSuccessToast = false;
      }, 3000);
    }, 500);
  }

  buyNow(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    this.cartService.addToCart(this.product, this.quantity);
    this.router.navigate(['/checkout']);
  }
}
