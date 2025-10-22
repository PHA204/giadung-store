// giadung-admin/src/app/pages/reviews-list/reviews-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.css'
})
export class ReviewsListComponent implements OnInit {
  private reviewsService = inject(ReviewsService);
  
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  paginatedReviews: Review[] = [];
  
  loading = false;
  searchTerm = '';
  errorMessage = '';
  selectedRating = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  // Rating options
  ratingOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: '5', label: '⭐⭐⭐⭐⭐ (5 sao)' },
    { value: '4', label: '⭐⭐⭐⭐ (4 sao)' },
    { value: '3', label: '⭐⭐⭐ (3 sao)' },
    { value: '2', label: '⭐⭐ (2 sao)' },
    { value: '1', label: '⭐ (1 sao)' }
  ];

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.reviewsService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.errorMessage = 'Lỗi khi tải danh sách đánh giá. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onRatingChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.reviews];

    // Filter by rating
    if (this.selectedRating !== 'all') {
      const rating = parseInt(this.selectedRating);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Filter by search term
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(review =>
        review.user?.fullName?.toLowerCase().includes(term) ||
        review.product?.productName?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term)
      );
    }

    this.filteredReviews = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReviews.length / this.itemsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
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
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredReviews.length);
    return `${start}-${end}`;
  }

  getStars(rating: number): string {
    return '⭐'.repeat(rating);
  }

  onDelete(reviewId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return;
    }

    this.reviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        alert('Xóa đánh giá thành công!');
        this.loadReviews();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        alert('Lỗi khi xóa đánh giá!');
      }
    });
  }
}