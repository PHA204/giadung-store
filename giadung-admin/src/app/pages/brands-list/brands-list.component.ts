// giadung-admin/src/app/pages/brands-list/brands-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brands-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="brands-container">
      <div class="page-header">
        <h1>Quản Lý Thương Hiệu</h1>
        <button class="btn btn-primary" (click)="openAddModal()">
          + Thêm Thương Hiệu
        </button>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="onSearch()"
          placeholder="Tìm kiếm thương hiệu..."
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
              <th>Tên Thương Hiệu</th>
              <th>Mô Tả</th>
              <th>Ngày Tạo</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let brand of filteredBrands">
              <td>{{ brand.brandId }}</td>
              <td><strong>{{ brand.brandName }}</strong></td>
              <td>{{ brand.description || 'N/A' }}</td>
              <td>{{ brand.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-edit" 
                    (click)="openEditModal(brand)"
                    title="Sửa">
                    ✏️
                  </button>
                  <button 
                    class="btn-delete" 
                    (click)="onDelete(brand.brandId!)"
                    title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="no-data" *ngIf="filteredBrands.length === 0">
          <p>Không tìm thấy thương hiệu nào</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" [class.show]="showModal" *ngIf="showModal">
      <div class="modal-content">
        <span class="close" (click)="closeModal()">&times;</span>
        <h2>{{ isEditMode ? 'Sửa Thương Hiệu' : 'Thêm Thương Hiệu' }}</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="brandName">Tên Thương Hiệu: <span class="required">*</span></label>
            <input 
              type="text" 
              id="brandName" 
              [(ngModel)]="currentBrand.brandName"
              name="brandName"
              required>
          </div>
          <div class="form-group">
            <label for="description">Mô Tả:</label>
            <textarea 
              id="description" 
              [(ngModel)]="currentBrand.description"
              name="description"
              rows="4"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? '⏳ Đang lưu...' : '💾 Lưu' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="closeModal()">
              ❌ Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .brands-container {
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

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
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

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms ease-in-out;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1e40af;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    /* Modal Styles */
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal.show {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 90%;
      position: relative;
    }

    .modal-content h2 {
      margin-bottom: 1.5rem;
      color: #111827;
    }

    .close {
      position: absolute;
      right: 1.5rem;
      top: 1.5rem;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
    }

    .close:hover {
      color: #111827;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .required {
      color: #ef4444;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
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

      .data-table th,
      .data-table td {
        padding: 0.5rem;
        font-size: 0.75rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class BrandsListComponent implements OnInit {
  private brandsService = inject(BrandsService);
  
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  loading = false;
  saving = false;
  searchTerm = '';
  errorMessage = '';
  
  showModal = false;
  isEditMode = false;
  currentBrand: Brand = { brandName: '', description: '' };

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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.errorMessage = 'Lỗi khi tải danh sách thương hiệu. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredBrands = this.brands;
      return;
    }

    this.filteredBrands = this.brands.filter(brand => 
      brand.brandName.toLowerCase().includes(term) ||
      (brand.description && brand.description.toLowerCase().includes(term))
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentBrand = { brandName: '', description: '' };
    this.showModal = true;
  }

  openEditModal(brand: Brand): void {
    this.isEditMode = true;
    this.currentBrand = { ...brand };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentBrand = { brandName: '', description: '' };
  }

  onSubmit(): void {
    if (!this.currentBrand.brandName.trim()) {
      alert('Vui lòng nhập tên thương hiệu!');
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.currentBrand.brandId) {
      this.brandsService.updateBrand(this.currentBrand.brandId, this.currentBrand).subscribe({
        next: () => {
          alert('Cập nhật thương hiệu thành công!');
          this.closeModal();
          this.loadBrands();
          this.saving = false;
        },
        error: (error) => {
          console.error('Error updating brand:', error);
          alert('Lỗi khi cập nhật thương hiệu!');
          this.saving = false;
        }
      });
    } else {
      this.brandsService.createBrand(this.currentBrand).subscribe({
        next: () => {
          alert('Thêm thương hiệu thành công!');
          this.closeModal();
          this.loadBrands();
          this.saving = false;
        },
        error: (error) => {
          console.error('Error creating brand:', error);
          alert('Lỗi khi thêm thương hiệu!');
          this.saving = false;
        }
      });
    }
  }

  onDelete(brandId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      return;
    }

    this.brandsService.deleteBrand(brandId).subscribe({
      next: () => {
        alert('Xóa thương hiệu thành công!');
        this.loadBrands();
      },
      error: (error) => {
        console.error('Error deleting brand:', error);
        alert('Lỗi khi xóa thương hiệu!');
      }
    });
  }
}