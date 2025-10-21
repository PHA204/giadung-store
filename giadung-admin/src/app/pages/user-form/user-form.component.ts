// giadung-admin/src/app/pages/user-form/user-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userForm!: FormGroup;
  isEditMode = false;
  userId?: number;
  loading = false;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phoneNumber: ['', [Validators.pattern(/^[0-9]{10,11}$/)]],
      address: [''],
      role: ['customer', Validators.required],
      isActive: [true]
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser(this.userId);
        // Password không bắt buộc khi edit
        this.userForm.get('password')?.clearValidators();
      } else {
        // Password bắt buộc khi thêm mới
        this.userForm.get('password')?.setValidators([
          Validators.required,
          Validators.minLength(6)
        ]);
      }
      this.userForm.get('password')?.updateValueAndValidity();
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.usersService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role,
          isActive: user.isActive
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        alert('Lỗi khi tải thông tin người dùng!');
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    const userData: User = this.userForm.value;

    if (this.isEditMode && this.userId) {
      // Nếu không đổi password, xóa field password
      if (!userData.password) {
        delete userData.password;
      }

      this.usersService.updateUser(this.userId, userData).subscribe({
        next: () => {
          alert('Cập nhật người dùng thành công!');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Lỗi khi cập nhật người dùng!');
          this.loading = false;
        }
      });
    } else {
      this.usersService.createUser(userData).subscribe({
        next: () => {
          alert('Thêm người dùng thành công!');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Lỗi khi thêm người dùng!');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  // Getter cho form controls
  get f() {
    return this.userForm.controls;
  }
}