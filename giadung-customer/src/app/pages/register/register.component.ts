import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    // Initialize form with validators
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern(/^[0-9]{10,11}$/)]],
      address: [''],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  get passwordsMatch(): boolean {
    return !this.registerForm.hasError('passwordMismatch');
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Prepare user data
    const userData = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phoneNumber: this.registerForm.value.phoneNumber || null,
      address: this.registerForm.value.address || null,
      role: 'CUSTOMER',
      isActive: true
    };

    // Call registration service
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.successMessage = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login'], { 
            state: { registered: true, email: userData.email }
          });
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        // Handle specific error cases
        if (error.status === 409) {
          this.errorMessage = 'Email đã được sử dụng. Vui lòng chọn email khác.';
        } else if (error.status === 400) {
          this.errorMessage = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
        } else {
          this.errorMessage = 'Đăng ký thất bại. Vui lòng thử lại sau.';
        }
        
        this.loading = false;
      }
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched || this.submitted));
  }
}