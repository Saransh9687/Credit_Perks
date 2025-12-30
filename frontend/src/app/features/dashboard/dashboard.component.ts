import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
      </div>

      <div class="welcome-banner card">
        <h2>Welcome back, {{ authService.currentUser()?.username }}</h2>
        <p>Manage customer rewards, transactions, and redemptions.</p>
      </div>

      <div class="dashboard-grid">
        <!-- Admin Section -->
        <ng-container *ngIf="authService.isAdmin()">
          <div class="action-card" routerLink="/ces-users">
            <div class="icon">👥</div>
            <h3>Manage CES Users</h3>
            <p>Create and remove system access</p>
          </div>
        </ng-container>

        <!-- Common Section -->
        <div class="action-card" routerLink="/customers">
          <div class="icon">👤</div>
          <h3>Customers</h3>
          <p>Search and manage customer profiles</p>
        </div>

        <div class="action-card" routerLink="/customers/new">
          <div class="icon">✨</div>
          <h3>New Customer</h3>
          <p>Register a new customer account</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-banner {
      background: linear-gradient(to right, #333, #555);
      color: white;
      margin-bottom: 2rem;
    }
    
    .welcome-banner p {
      margin: 0.5rem 0 0;
      opacity: 0.9;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #eee;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
      border-color: var(--color-primary);
    }

    .icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .action-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
}
