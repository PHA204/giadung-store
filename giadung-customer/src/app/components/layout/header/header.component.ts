import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/">
              <h1>🏠 Gia Dụng Store</h1>
            </a>
          </div>

          <nav class="nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              Trang chủ
            </a>
            <a routerLink="/products" routerLinkActive="active">
              Sản phẩm
            </a>
            <a *ngIf="currentUser" routerLink="/orders" routerLinkActive="active">
              Đơn hàng
            </a>
          </nav>

          <div class="header-actions">
            <a routerLink="/cart" class="cart-icon">
              🛒 
              <span class="cart-count" *ngIf="cartCount > 0">{{ cartCount }}</span>
            </a>

            <!-- ✅ FIXED USER MENU -->
            <div class="user-menu" *ngIf="currentUser; else loginButton">
              <button class="user-button" (click)="toggleDropdown($event)">
                👤 {{ currentUser.fullName }}
                <span class="arrow" [class.open]="isDropdownOpen">▼</span>
              </button>
              
              <!-- ✅ Dropdown sẽ không biến mất khi di chuột vào -->
              <div class="dropdown-menu" 
                   [class.show]="isDropdownOpen"
                   (click)="$event.stopPropagation()">
                <div class="dropdown-header">
                  <div class="user-info">
                    <div class="user-avatar">{{ getInitials(currentUser.fullName) }}</div>
                    <div class="user-details">
                      <p class="user-name">{{ currentUser.fullName }}</p>
                      <p class="user-email">{{ currentUser.email }}</p>
                    </div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a routerLink="/orders" class="dropdown-item" (click)="closeDropdown()">
                  <span class="item-icon">📦</span>
                  <span>Đơn hàng của tôi</span>
                </a>
                <a routerLink="/profile" class="dropdown-item" (click)="closeDropdown()">
                  <span class="item-icon">👤</span>
                  <span>Thông tin cá nhân</span>
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout-item" (click)="logout($event)">
                  <span class="item-icon">🚪</span>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>

            <ng-template #loginButton>
              <a routerLink="/login" class="btn btn-primary">Đăng nhập</a>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  currentUser: User | null = null;
  cartCount: number = 0;
  isDropdownOpen = false;

  // ✅ Đóng dropdown khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.isDropdownOpen = false;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  logout(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.authService.logout();
    this.closeDropdown();
    this.router.navigate(['/']);
  }
}