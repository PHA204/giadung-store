// giadung-admin/src/app/components/layout/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Bảng Điều Khiển</h3>
      </div>
      <ul class="sidebar-menu">
        <li class="sidebar-item">
          <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">📊</span>
            <span>Trang Chủ</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a routerLink="/users" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">👥</span>
            <span>Người Dùng</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a routerLink="/products" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">📦</span>
            <span>Sản Phẩm</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a routerLink="/orders" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">🛍️</span>
            <span>Đơn Hàng</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a routerLink="/reviews" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">⭐</span>
            <span>Đánh Giá</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a routerLink="/categories" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">📂</span>
            <span>Danh Mục</span>
          </a>
        </li>
        <li class="sidebar-item">
          <a routerLink="/brands" routerLinkActive="active" class="sidebar-link">
            <span class="sidebar-icon">🏷️</span>
            <span>Thương Hiệu</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #1f2937;
      color: white;
      height: 100%;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #374151;
      background-color: #111827;
    }

    .sidebar-header h3 {
      margin: 0;
      font-size: 1.125rem;
      color: white;
    }

    .sidebar-menu {
      list-style: none;
      padding: 1rem 0;
      margin: 0;
    }

    .sidebar-item {
      padding: 0;
      margin: 0;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      color: #d1d5db;
      text-decoration: none;
      transition: all 200ms ease-in-out;
      font-size: 0.938rem;
    }

    .sidebar-link:hover {
      background-color: #374151;
      color: white;
      padding-left: 2rem;
    }

    .sidebar-link.active {
      background-color: #2563eb;
      color: white;
      border-left: 4px solid #3b82f6;
      padding-left: calc(1.5rem - 4px);
    }

    .sidebar-icon {
      font-size: 1.25rem;
      width: 24px;
      display: inline-block;
      text-align: center;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
      }

      .sidebar-menu {
        display: flex;
        overflow-x: auto;
        padding: 0;
      }

      .sidebar-link {
        padding: 1rem 1.5rem;
        white-space: nowrap;
      }

      .sidebar-link:hover {
        padding-left: 1.5rem;
      }
    }
  `]
})
export class SidebarComponent {}