import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  paginatedCategories: Category[] = [];

  loading = false;
  errorMessage = '';
  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50, 100];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';

    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Lỗi khi tải danh sách danh mục.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(
      c => c.categoryName.toLowerCase().includes(term) ||
           (c.description && c.description.toLowerCase().includes(term))
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCategories = this.filteredCategories.slice(start, end);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredCategories.length);
    return `${start}-${end}`;
  }

  onDelete(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        alert('Xóa danh mục thành công!');
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        alert('Lỗi khi xóa danh mục!');
      }
    });
  }
}
