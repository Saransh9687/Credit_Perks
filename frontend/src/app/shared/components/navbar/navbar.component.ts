import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" *ngIf="authService.currentUser()">
      <div class="navbar-brand">
        <span class="brand-text">AURUM<span class="brand-highlight">X</span></span>
      </div>
      
      <div class="navbar-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">Dashboard</a>
        
        <ng-container *ngIf="authService.isAdmin()">
          <a routerLink="/ces-users" routerLinkActive="active" class="nav-item">CES Users</a>
        </ng-container>
        
        <a routerLink="/customers" routerLinkActive="active" class="nav-item">Customers</a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-item">My Profile</a>
      </div>

      <div class="navbar-end">
        <span class="user-info">
          {{ authService.currentUser()?.username }} 
          <span class="role-badge" [class.admin]="authService.isAdmin()">
            {{ authService.isAdmin() ? 'ADMIN' : 'CES' }}
          </span>
        </span>
        <button class="btn-logout" (click)="authService.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      height: 64px;
      background-color: var(--color-bg-card);
      border-bottom: 1px solid var(--color-border);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.05em;
    }

    .brand-highlight {
      color: var(--color-primary);
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
    }

    .nav-item {
      text-decoration: none;
      color: var(--color-text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.5rem 0;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .nav-item:hover {
      color: var(--color-primary);
    }

    .nav-item.active {
      color: var(--color-primary);
      border-bottom-color: var(--color-primary);
    }

    .navbar-end {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .role-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background-color: #e0e0e0;
      color: #333;
    }

    .role-badge.admin {
      background-color: var(--color-primary-light);
      color: var(--color-primary-dark);
    }

    .btn-logout {
      background: none;
      border: 1px solid var(--color-border);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background-color: #ffebee;
      border-color: #ffcdd2;
      color: #c62828;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
}
