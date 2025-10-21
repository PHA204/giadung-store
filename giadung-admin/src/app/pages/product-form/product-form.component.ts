// giadung-admin/src/app/pages/product-form/product-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { BrandsService } from '../../services/brands.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="product-form-container">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm' }}</h1>
        <button class="btn btn-secondary" routerLink="/products">
          ← Quay lại
        </button>
      </div>

      <div class="form-card">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="productName">Tên Sản Phẩm <span class="required">*</span></label>
              <input 
                type="text" 
                id="productName" 
                formControlName="productName"
                [class.error]="submitted && f['productName'].errors">
              <small class="error-message" *ngIf="submitted && f['productName'].errors?.['required']">
                Vui lòng nhập tên sản phẩm
              </small>
              <small class="error-message" *ngIf="submitted && f['productName'].errors?.['minlength']">
                Tên sản phẩm phải có ít nhất 3 ký tự
              </small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Danh Mục</label>
              <select id="category" formControlName="categoryId">
                <option value="">-- Chọn danh mục --</option>
                <option *ngFor="let cat of categories" [value]="cat.categoryId">
                  {{ cat.categoryName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="brand">Thương Hiệu</label>
              <select id="brand" formControlName="brandId">
                <option value="">-- Chọn thương hiệu --</option>
                <option *ngFor="let brand of brands" [value]="brand.brandId">
                  {{ brand.brandName }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Mô Tả</label>
            <textarea 
              id="description" 
              formControlName="description" 
              rows="4"
              placeholder="Mô tả chi tiết về sản phẩm...">
            </textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Giá (VNĐ) <span class="required">*</span></label>
              <input 
                type="number" 
                id="price" 
                formControlName="price"
                [class.error]="submitted && f['price'].errors"
                min="0"
                step="1000">
              <small class="error-message" *ngIf="submitted && f['price'].errors?.['required']">
                Vui lòng nhập giá sản phẩm
              </small>
              <small class="error-message" *ngIf="submitted && f['price'].errors?.['min']">
                Giá phải lớn hơn 0
              </small>
            </div>

            <div class="form-group">
              <label for="discount">Giảm Giá (%)</label>
              <input 
                type="number" 
                id="discount" 
                formControlName="discount"
                min="0"
                max="100"
                step="1">
              <small>Nhập từ 0 đến 100</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="stockQuantity">Số Lượng Tồn Kho <span class="required">*</span></label>
              <input 
                type="number" 
                id="stockQuantity" 
                formControlName="stockQuantity"
                [class.error]="submitted && f['stockQuantity'].errors"
                min="0"
                step="1">
              <small class="error-message" *ngIf="submitted && f['stockQuantity'].errors?.['required']">
                Vui lòng nhập số lượng tồn kho
              </small>
            </div>

            <div class="form-group">
              <label for="ratingAvg">Đánh Giá Trung Bình</label>
              <input 
                type="number" 
                id="ratingAvg" 
                formControlName="ratingAvg"
                min="0"
                max="5"
                step="0.1"
                readonly>
              <small>Từ 0 đến 5 sao</small>
            </div>
          </div>

          <div class="form-group">
            <label for="imageUrl">URL Hình Ảnh</label>
            <input 
              type="url" 
              id="imageUrl" 
              formControlName="imageUrl"
              placeholder="https://example.com/image.jpg">
            <small>Nhập đường dẫn URL của hình ảnh sản phẩm</small>
          </div>

          <!-- Preview ảnh -->
          <div class="image-preview" *ngIf="f['imageUrl'].value">
            <label>Xem Trước:</label>
            <img [src]="f['imageUrl'].value" 
                 alt="Preview" 
                 (error)="onImageError($event)"
                 class="preview-img">
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="loading">
              <span *ngIf="loading">⏳ Đang xử lý...</span>
              <span *ngIf="!loading">💾 {{ isEditMode ? 'Cập Nhật' : 'Thêm Mới' }}</span>
            </button>
            <button 
              type="button" 
              class="btn btn-secondary" 
              (click)="onCancel()"
              [disabled]="loading">
              ❌ Hủy
            </button>
          </div>
        </form>
      </div>

      <div class="loading-overlay" *ngIf="loading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .product-form-container {
      max-width: 800px;
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

    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .required {
      color: #ef4444;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    input.error {
      border-color: #ef4444;
    }

    small {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .error-message {
      color: #ef4444;
    }

    .image-preview {
      margin-top: 1rem;
      padding: 1rem;
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      text-align: center;
    }

    .preview-img {
      max-width: 300px;
      max-height: 300px;
      margin-top: 0.5rem;
      border-radius: 0.5rem;
      object-fit: contain;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1e40af;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #4b5563;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .product-form-container {
        padding: 1rem;
      }

      .form-card {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private brandsService = inject(BrandsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm!: FormGroup;
  isEditMode = false;
  productId?: number;
  loading = false;
  submitted = false;
  
  categories: Category[] = [];
  brands: Brand[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadBrands();
    this.checkEditMode();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: [''],
      brandId: [''],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      ratingAvg: [0]
    });
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (data) => this.brands = data,
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          productName: product.productName,
          categoryId: product.category?.categoryId || '',
          brandId: product.brand?.brandId || '',
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          stockQuantity: product.stockQuantity,
          imageUrl: product.imageUrl,
          ratingAvg: product.ratingAvg || 0
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alert('Lỗi khi tải thông tin sản phẩm!');
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.productForm.value;
    
    const productData: Product = {
      productName: formValue.productName,
      description: formValue.description,
      price: formValue.price,
      discount: formValue.discount,
      stockQuantity: formValue.stockQuantity,
      imageUrl: formValue.imageUrl,
      ratingAvg: formValue.ratingAvg
    };

    // Add category if selected
    if (formValue.categoryId) {
      const category = this.categories.find(c => c.categoryId === +formValue.categoryId);
      if (category) {
        productData.category = category;
      }
    }

    // Add brand if selected
    if (formValue.brandId) {
      const brand = this.brands.find(b => b.brandId === +formValue.brandId);
      if (brand) {
        productData.brand = brand;
      }
    }

    if (this.isEditMode && this.productId) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Lỗi khi cập nhật sản phẩm!');
          this.loading = false;
        }
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Lỗi khi thêm sản phẩm!');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    if (confirm('Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.')) {
      this.router.navigate(['/products']);
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }

  get f() {
    return this.productForm.controls;
  }
}