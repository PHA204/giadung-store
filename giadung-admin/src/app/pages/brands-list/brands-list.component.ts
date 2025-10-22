// src/app/pages/brands-list/brands-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brands-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.css'
})
export class BrandsListComponent implements OnInit {
  private brandsService = inject(BrandsService);

  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  paginatedBrands: Brand[] = [];

  loading = false;
  errorMessage = '';
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50, 100];

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.errorMessage = '';

    this.brandsService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.filteredBrands = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.errorMessage = 'Lỗi khi tải danh sách nhãn hiệu. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBrands = this.brands;
    } else {
      this.filteredBrands = this.brands.filter(brand =>
        brand.brandName.toLowerCase().includes(term) ||
        (brand.description && brand.description.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBrands.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBrands = this.filteredBrands.slice(startIndex, endIndex);
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

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredBrands.length);
    return `${start}-${end}`;
  }

  onDelete(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa nhãn hiệu này?')) return;

    this.brandsService.deleteBrand(id).subscribe({
      next: () => {
        alert('Xóa nhãn hiệu thành công!');
        this.loadBrands();
      },
      error: (error) => {
        console.error('Error deleting brand:', error);
        alert('Lỗi khi xóa nhãn hiệu!');
      }
    });
  }
}
