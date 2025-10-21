// giadung-admin/src/app/components/layout/navbar/navbar.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h2>Admin Dashboard</h2>
      </div>
      <div class="navbar-user">
        <div class="user-avatar">A</div>
        <span>Admin</span>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 64px;
    }

    .navbar-brand h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2563eb;
      margin: 0;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .navbar-user span {
      font-weight: 500;
      color: #374151;
    }
  `]
})
export class NavbarComponent {}