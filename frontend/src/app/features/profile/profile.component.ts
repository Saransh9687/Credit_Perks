import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">My Profile</h1>
      </div>

      <div class="card profile-card" *ngIf="authService.currentUser() as user">
         <div class="profile-header">
            <div class="avatar-placeholder">{{ user.username.charAt(0).toUpperCase() }}</div>
            <div class="user-details">
               <h2>{{ user.username }}</h2>
               <span class="role-badge">{{ user.role }}</span>
            </div>
         </div>

         <div class="profile-info">
            <div class="info-group">
               <label>System Role</label>
               <p>{{ user.role === 'ROLE_ADMIN_CES' ? 'Administrator' : 'CES User' }}</p>
            </div>
            <div class="info-group">
               <label>Account Status</label>
               <p class="status-active">Active</p>
            </div>
            
            <!-- Future phases might add activity logs or password change here -->
         </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-card {
       max-width: 600px;
       margin: 0 auto;
    }
    
    .profile-header {
       display: flex;
       align-items: center;
       gap: 1.5rem;
       padding-bottom: 2rem;
       border-bottom: 1px solid #eee;
       margin-bottom: 2rem;
    }

    .avatar-placeholder {
       width: 80px;
       height: 80px;
       border-radius: 50%;
       background-color: var(--color-primary);
       color: white;
       font-size: 2.5rem;
       display: flex;
       align-items: center;
       justify-content: center;
       font-weight: bold;
    }

    .user-details h2 { margin: 0 0 0.5rem 0; }
    
    .role-badge {
       background: #eee;
       padding: 0.25rem 0.75rem;
       border-radius: 4px;
       font-size: 0.9rem;
       color: #555;
    }

    .info-group { margin-bottom: 1.5rem; }
    .info-group label { display: block; color: #888; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .info-group p { margin: 0; font-size: 1.1rem; font-weight: 500; }
    
    .status-active { color: var(--color-success); }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
}
