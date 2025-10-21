// giadung-admin/src/app/pages/users-list/users-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  private usersService = inject(UsersService);
  
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Lỗi khi tải danh sách người dùng. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.phoneNumber && user.phoneNumber.includes(term))
    );
  }

  onDelete(userId: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        alert('Xóa người dùng thành công!');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Lỗi khi xóa người dùng!');
      }
    });
  }
}