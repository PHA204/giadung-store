import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId?: number;
  loading = false;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoriesService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          categoryName: category.categoryName,
          description: category.description
        });
        this.loading = false;
      },
      error: () => {
        alert('Lỗi khi tải danh mục!');
        this.router.navigate(['/categories']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.categoryForm.invalid) return;

    const categoryData: Category = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      this.categoriesService.updateCategory(this.categoryId, categoryData).subscribe({
        next: () => {
          alert('Cập nhật danh mục thành công!');
          this.router.navigate(['/categories']);
        },
        error: () => alert('Lỗi khi cập nhật danh mục!')
      });
    } else {
      this.categoriesService.createCategory(categoryData).subscribe({
        next: () => {
          alert('Thêm danh mục thành công!');
          this.router.navigate(['/categories']);
        },
        error: () => alert('Lỗi khi thêm danh mục!')
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }

  get f() {
    return this.categoryForm.controls;
  }
}
