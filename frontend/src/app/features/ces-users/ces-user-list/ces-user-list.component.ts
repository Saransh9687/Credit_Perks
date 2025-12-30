import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CesUserService } from '../../../core/services/ces-user.service';
import { CesUser } from '../../../core/models/ces-user.model';
import { UserRole } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-ces-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">CES User Management</h1>
        <button class="btn btn-primary" (click)="toggleCreateForm()">
          {{ showForm() ? 'Cancel' : 'Create New User' }}
        </button>
      </div>

      <div class="card create-form-card" *ngIf="showForm()">
        <h3>Create New User</h3>
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label>Username</label>
              <input type="text" formControlName="username" class="form-control" placeholder="username">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" formControlName="password" class="form-control" placeholder="password">
            </div>
            <div class="form-group">
              <label>Role</label>
              <select formControlName="role" class="form-control">
                <option [value]="roles.USER">CES User (Regular)</option>
                </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || isSubmitting()">
                {{ isSubmitting() ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </div>
          <p class="error-text" *ngIf="createError()">{{ createError() }}</p>
        </form>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of regularUsers()">
                <td>#{{ user.id }}</td>
                <td class="username">{{ user.username }}</td>
                <td>
                  <span class="badge">Regular</span>
                </td>
                <td>
                  <span class="status-indicator active">Active</span>
                </td>
                <td>
                  <button
                    class="btn btn-danger btn-sm"
                    [disabled]="isCurrentUser(user.username)"
                    (click)="deleteUser(user)"
                    title="Delete User"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr *ngIf="regularUsers().length === 0">
                <td colspan="5" class="empty-state">No regular users found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-form-card {
      margin-bottom: 2rem;
      background-color: #fafbfc;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      align-items: end;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
      font-weight: 500;
      color: #555;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th, .table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .table th {
      font-weight: 600;
      color: #444;
      background-color: #f8f9fa;
    }

    .username {
      font-weight: 500;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      background-color: #e0e0e0;
      color: #333;
    }

    .status-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccc;
      margin-right: 0.5rem;
    }

    .status-indicator.active {
      background-color: var(--color-success);
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.85rem;
    }

    .error-text {
      color: var(--color-error);
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #777;
    }
  `]
})
export class CesUserListComponent implements OnInit {
  cesUserService = inject(CesUserService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  // Original list of all users from API
  users = signal<CesUser[]>([]);

  // NEW: Computed list that filters out ADMINS automatically
  regularUsers = computed(() =>
    this.users().filter(user => user.role !== UserRole.ADMIN)
  );

  showForm = signal(false);
  isSubmitting = signal(false);
  createError = signal('');

  roles = UserRole;

  userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: [UserRole.USER, Validators.required]
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.cesUserService.getAllUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  toggleCreateForm() {
    this.showForm.update(v => !v);
    this.createError.set('');
    this.userForm.reset({ role: UserRole.USER });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting.set(true);
      this.createError.set('');

      this.cesUserService.createUser(this.userForm.value as any).subscribe({
        next: (newUser) => {
          // Updating the main signal automatically updates the computed regularUsers list
          this.users.update(list => [...list, newUser]);
          this.isSubmitting.set(false);
          this.toggleCreateForm();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.createError.set(err.error?.message || 'Failed to create user. Username might be taken.');
        }
      });
    }
  }

  deleteUser(user: CesUser) {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this.cesUserService.deleteUser(user.id).subscribe({
        next: () => {
          this.users.update(list => list.filter(u => u.id !== user.id));
        },
        error: (err) => {
          alert('Failed to delete user: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  isCurrentUser(username: string): boolean {
    return this.authService.currentUser()?.username === username;
  }
}
