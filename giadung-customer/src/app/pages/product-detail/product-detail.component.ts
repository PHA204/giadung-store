import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ReviewsService } from '../../services/reviews.service';
import { Product } from '../../models/product.model';
import { Review } from '../../models/review.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public router = inject(Router); // ✅ Đổi thành public
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private reviewsService = inject(ReviewsService);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  reviews: Review[] = [];
  currentUser: User | null = null;
  currentUrl: string = ''; // ✅ Thêm property này
  
  quantity: number = 1;
  loading = true;
  loadingRelated = false;
  loadingReviews = false;
  error: string | null = null;
  addingToCart = false;
  showSuccessToast = false;
  
  // Review form
  activeTab: string = 'description';
  newReview = {
    rating: 5,
    comment: ''
  };
  submittingReview = false;
  reviewError: string | null = null;
  reviewSuccess: string | null = null;

  ngOnInit(): void {
    // ✅ Lưu current URL
    this.currentUrl = this.router.url;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
      this.loadReviews(+id);
      this.loadCurrentUser();
    } else {
      this.error = 'ID sản phẩm không hợp lệ';
      this.loading = false;
    }
  }

  loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        
        // Load related products
        if (data.category?.categoryId) {
          this.loadRelatedProducts(data.category.categoryId, id);
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Không thể tải thông tin sản phẩm';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(categoryId: number, excludeId: number): void {
    this.loadingRelated = true;
    this.productsService.getAllProducts(0, 8, 'createdAt', 'desc').subscribe({
      next: (response) => {
        this.relatedProducts = response.products
          .filter(p => 
            p.category?.categoryId === categoryId && 
            p.productId !== excludeId
          )
          .slice(0, 4);
        this.loadingRelated = false;
      },
      error: (err) => {
        console.error('Error loading related products:', err);
        this.loadingRelated = false;
      }
    });
  }

  loadReviews(productId: number): void {
    this.loadingReviews = true;
    this.reviewsService.getReviewsByProductId(productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loadingReviews = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.loadingReviews = false;
      }
    });
  }

  // Review methods
  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    if (!this.newReview.comment.trim()) {
      this.reviewError = 'Vui lòng nhập nội dung đánh giá';
      return;
    }

    this.submittingReview = true;
    this.reviewError = null;
    this.reviewSuccess = null;

    const review: Review = {
      user: this.currentUser,
      product: this.product!,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    };

    this.reviewsService.createReview(review).subscribe({
      next: () => {
        this.reviewSuccess = 'Đánh giá của bạn đã được gửi thành công!';
        this.newReview = { rating: 5, comment: '' };
        this.submittingReview = false;
        
        // Reload reviews
        if (this.product?.productId) {
          this.loadReviews(this.product.productId);
        }

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.reviewSuccess = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.reviewError = 'Không thể gửi đánh giá. Vui lòng thử lại.';
        this.submittingReview = false;
      }
    });
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
  }

  getRatingDistribution(rating: number): number {
    if (this.reviews.length === 0) return 0;
    const count = this.reviews.filter(r => r.rating === rating).length;
    return (count / this.reviews.length) * 100;
  }

  // Existing methods
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

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
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

  addRelatedToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.cartService.addToCart(product, 1);
    this.showSuccessToast = true;
    
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  trackByProduct(index: number, product: Product): number {
    return product.productId || index;
  }

  trackByReview(index: number, review: Review): number {
    return review.reviewId || index;
  }
}