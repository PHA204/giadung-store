import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.css'
})
export class BrandFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private brandsService = inject(BrandsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  brandForm!: FormGroup;
  isEditMode = false;
  brandId?: number;
  loading = false;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.brandForm = this.fb.group({
      brandName: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.brandId = +params['id'];
        this.loadBrand(this.brandId);
      }
    });
  }

  loadBrand(id: number): void {
    this.loading = true;
    this.brandsService.getBrandById(id).subscribe({
      next: (brand) => {
        this.brandForm.patchValue({
          brandName: brand.brandName,
          description: brand.description
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading brand:', error);
        alert('Lỗi khi tải thông tin nhãn hiệu!');
        this.router.navigate(['/brands']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.brandForm.invalid) return;

    this.loading = true;
    const brandData: Brand = this.brandForm.value;

    if (this.isEditMode && this.brandId) {
      this.brandsService.updateBrand(this.brandId, brandData).subscribe({
        next: () => {
          alert('Cập nhật nhãn hiệu thành công!');
          this.router.navigate(['/brands']);
        },
        error: (error) => {
          console.error('Error updating brand:', error);
          alert('Lỗi khi cập nhật nhãn hiệu!');
          this.loading = false;
        }
      });
    } else {
      this.brandsService.createBrand(brandData).subscribe({
        next: () => {
          alert('Thêm nhãn hiệu thành công!');
          this.router.navigate(['/brands']);
        },
        error: (error) => {
          console.error('Error creating brand:', error);
          alert('Lỗi khi thêm nhãn hiệu!');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/brands']);
  }

  get f() {
    return this.brandForm.controls;
  }
}
