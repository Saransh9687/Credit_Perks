import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>AURUM<span class="highlight">X</span></h1>
          <p>CES Reward Platform</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username" 
              placeholder="Enter your username"
              [class.error]="isFieldInvalid('username')"
            >
            <div class="error-msg" *ngIf="isFieldInvalid('username')">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              placeholder="Enter your password"
              [class.error]="isFieldInvalid('password')"
            >
            <div class="error-msg" *ngIf="isFieldInvalid('password')">
              Password is required
            </div>
          </div>

          <div class="form-error" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading()">
            <span *ngIf="!isLoading()">Login</span>
            <span *ngIf="isLoading()">Authenticating...</span>
          </button>
        </form>
        
        <div class="login-footer">
          <p class="small">Internal System Only</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      letter-spacing: -1px;
    }

    .highlight {
      color: var(--color-primary, #d4af37);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: var(--color-primary, #d4af37);
    }

    input.error {
      border-color: #ef5350;
    }

    .error-msg {
      color: #ef5350;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .form-error {
      background-color: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
    }

    button {
      width: 100%;
      padding: 0.875rem;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
      background-color: #000;
    }

    button:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
    
    .login-footer {
      margin-top: 2rem;
      text-align: center;
      color: #888;
    }
    
    .small {
      font-size: 0.8rem;
    }
  `]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.status === 401 ? 'Invalid credentials' : 'Login failed. Try again.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
