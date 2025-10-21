// giadung-admin/src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Tổng Người Dùng</div>
            <div class="stat-value">{{ totalUsers }}</div>
            <div class="stat-change positive">↑ 12% từ tháng trước</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-label">Tổng Sản Phẩm</div>
            <div class="stat-value">{{ totalProducts }}</div>
            <div class="stat-change positive">↑ 8% từ tháng trước</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-content">
            <div class="stat-label">Đơn Hàng Mới</div>
            <div class="stat-value">0</div>
            <div class="stat-change neutral">Không có thay đổi</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-label">Doanh Thu</div>
            <div class="stat-value">0 ₫</div>
            <div class="stat-change negative">↓ 5% từ tháng trước</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Thao Tác Nhanh</h2>
        <div class="actions-grid">
          <button class="action-btn" routerLink="/users/add">
            <span class="action-icon">👤</span>
            <span>Thêm Người Dùng</span>
          </button>
          <button class="action-btn" routerLink="/products/add">
            <span class="action-icon">📦</span>
            <span>Thêm Sản Phẩm</span>
          </button>
          <button class="action-btn" routerLink="/categories">
            <span class="action-icon">📂</span>
            <span>Quản Lý Danh Mục</span>
          </button>
          <button class="action-btn" routerLink="/brands">
            <span class="action-icon">🏷️</span>
            <span>Quản Lý Thương Hiệu</span>
          </button>
        </div>
      </div>

      <div class="loading-container" *ngIf="loading">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      font-size: 1.875rem;
      color: #111827;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #111827;
      margin-bottom: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 200ms ease-in-out;
      display: flex;
      gap: 1rem;
    }

    .stat-card:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eff6ff;
      border-radius: 0.75rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .stat-change {
      font-size: 0.875rem;
    }

    .stat-change.positive {
      color: #10b981;
    }

    .stat-change.negative {
      color: #ef4444;
    }

    .stat-change.neutral {
      color: #6b7280;
    }

    .quick-actions {
      background-color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background-color: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 200ms ease-in-out;
      text-decoration: none;
      color: #374151;
      font-weight: 500;
    }

    .action-btn:hover {
      background-color: #eff6ff;
      border-color: #2563eb;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
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

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private usersService = inject(UsersService);
  private productsService = inject(ProductsService);

  totalUsers = 0;
  totalProducts = 0;
  loading = false;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (error) => console.error('Error loading users:', error)
    });

    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }
}