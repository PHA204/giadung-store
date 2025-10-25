// 📁 giadung-customer/src/app/pages/login/login.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🏠 Gia Dụng Store</h1>
          <p class="subtitle">Đăng nhập để tiếp tục</p>
        </div>

        <!-- ✅ ALERT MESSAGES -->
        <div *ngIf="errorMessage" class="alert alert-error">
          <span>❌</span>
          <p>{{ errorMessage }}</p>
          <button class="close-btn" (click)="errorMessage = null">×</button>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          <span>✓</span>
          <p>{{ successMessage }}</p>
        </div>

        <!-- ✅ LOGIN FORM -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">
              Email <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="example@email.com"
                [class.error]="submitted && f['email'].errors"
                autocomplete="email">
            </div>
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <span *ngIf="f['email'].errors['required']">Email là bắt buộc</span>
              <span *ngIf="f['email'].errors['email']">Email không hợp lệ</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">
              Mật khẩu <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                placeholder="••••••••"
                [class.error]="submitted && f['password'].errors"
                autocomplete="current-password">
              <button 
                type="button" 
                class="toggle-password"
                (click)="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <span *ngIf="f['password'].errors['required']">Mật khẩu là bắt buộc</span>
              <span *ngIf="f['password'].errors['minlength']">Mật khẩu tối thiểu 6 ký tự</span>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe">
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" class="forgot-password">Quên mật khẩu?</a>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="loading">
            <span *ngIf="!loading">Đăng nhập</span>
            <span *ngIf="loading" class="loading-text">
              <span class="spinner"></span> Đang đăng nhập...
            </span>
          </button>

          <div class="divider">
            <span>hoặc</span>
          </div>

          <div class="social-login">
            <button type="button" class="btn btn-social btn-google" disabled>
              <img src="https://www.google.com/favicon.ico" alt="Google" width="20">
              Google
            </button>
            <button type="button" class="btn btn-social btn-facebook" disabled>
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" width="20">
              Facebook
            </button>
          </div>
        </form>

        <div class="auth-footer">
          <p>
            Chưa có tài khoản? 
            <a routerLink="/register" class="link">Đăng ký ngay</a>
          </p>
        </div>
      </div>

      <!-- ✅ FEATURES SIDEBAR -->
      <div class="features-sidebar">
        <div class="feature-card">
          <div class="feature-icon">🎁</div>
          <h3>Ưu đãi đặc biệt</h3>
          <p>Giảm giá lên đến 50% cho thành viên mới</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚚</div>
          <h3>Giao hàng nhanh</h3>
          <p>Miễn phí vận chuyển cho đơn hàng trên 500k</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Thanh toán bảo mật</h3>
          <p>Giao dịch an toàn với mã hóa SSL</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      margin: auto;
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 0.95rem;
    }

    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert-error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .alert-success {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .alert span:first-child {
      font-size: 1.25rem;
    }

    .alert p {
      flex: 1;
      margin: 0;
      font-size: 0.9rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.3s;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    .required {
      color: #ef4444;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      font-size: 1.2rem;
      pointer-events: none;
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      transition: all 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input.error {
      border-color: #ef4444;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      opacity: 0.6;
      transition: opacity 0.3s;
    }

    .toggle-password:hover {
      opacity: 1;
    }

    .error-message {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #ef4444;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #6b7280;
      cursor: pointer;
    }

    .checkbox-label input {
      width: auto;
      padding: 0;
      cursor: pointer;
    }

    .forgot-password {
      font-size: 0.9rem;
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s;
    }

    .forgot-password:hover {
      color: #5568d3;
      text-decoration: underline;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-block {
      width: 100%;
    }

    .loading-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 1.5rem 0;
      color: #9ca3af;
      font-size: 0.85rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e5e7eb;
    }

    .divider span {
      padding: 0 1rem;
    }

    .social-login {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .btn-social {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: white;
      border: 2px solid #e5e7eb;
      color: #374151;
      padding: 0.75rem;
    }

    .btn-social:hover:not(:disabled) {
      border-color: #667eea;
      background: #f9fafb;
    }

    .btn-social:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .link:hover {
      color: #5568d3;
      text-decoration: underline;
    }

    .features-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem 0;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 1rem;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }

    .feature-card p {
      opacity: 0.9;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    @media (max-width: 1024px) {
      .auth-container {
        grid-template-columns: 1fr;
      }

      .features-sidebar {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .auth-container {
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem 1.5rem;
      }

      .social-login {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  returnUrl: string = '/';

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Initialize form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Check for registration success message
    const state = history.state;
    if (state?.registered) {
      this.successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';
      setTimeout(() => this.successMessage = null, 5000);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user) {
          // Save remember me preference
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }

          // Show success message
          this.successMessage = `Chào mừng ${user.fullName}!`;

          // Redirect after short delay
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        } else {
          this.errorMessage = 'Email hoặc mật khẩu không đúng!';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        this.loading = false;
      }
    });
  }
}