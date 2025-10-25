import { Component, OnInit, inject } from '@angular/core';
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
              🛒 <span class="cart-count">{{ cartCount }}</span>
            </a>

            <div class="user-menu" *ngIf="currentUser; else loginButton">
              <button class="user-button">
                👤 {{ currentUser.fullName }}
              </button>
              <div class="dropdown-menu">
                <a routerLink="/orders">Đơn hàng của tôi</a>
                <a href="#" (click)="logout($event)">Đăng xuất</a>
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

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}