import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">New Customer</h1>
      </div>

      <div class="card form-card">
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">

          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" formControlName="name" minlength="2" maxlength="30" class="form-control" placeholder="John Doe">
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" maxlength="30" placeholder="example@tcs.com" pattern="^[a-zA-Z0-9._%+-]+@(tcs.com|gmail.com)$" title="Only emails from tcs.com or gmail.com are allowed" required class="form-control" >
            </div>

            <div class="form-group">
              <label>Phone</label>
              <input type="tel" formControlName="phone" class="form-control" placeholder="9876543210" maxlength ="10"
               [class.is-invalid]="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched"/>

              <div class="field-error" *ngIf="customerForm.get('phone')?.errors?.['pattern'] && customerForm.get('phone')?.touched">
                Must be 10 digits
              </div>
            </div>

            <div class="form-group">
              <label>Date of birth</label>
              <input type="date" #dateInput [max]="today" (change)="dateInput.value < today ? dateInput.value = today : null" formControlName="dateOfBirth" class="form-control">
            </div>

            <div class="form-group">
              <label>Association Date</label>
              <input type="date" #dateInput [max]="today" (change)="dateInput.value < today ? dateInput.value = today : null" formControlName="associationDate" class="form-control">
              <small class="helper-text">
                Determines customer type (Regular/Premium)
              </small>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="customerForm.invalid || isSubmitting()">
              {{ isSubmitting() ? 'Creating...' : 'Create Customer' }}
            </button>
          </div>

          <p class="error-text" *ngIf="errorMessage()">{{ errorMessage() }}</p>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .helper-text {
      color: #777;
      font-size: 0.8rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid #eee;
      padding-top: 1.5rem;
    }

    .error-text {
      color: var(--color-error);
      margin-top: 1rem;
      text-align: center;
    }
    .field-error { color: var(--color-error); font-size: 0.8rem; margin-top: 5px; }
    .is-invalid { border-color: var(--color-error); }
  `]
})
class CustomerCreateComponent {
  fb = inject(FormBuilder);
  customerService = inject(CustomerService);
  router = inject(Router);

  today = new Date().toISOString().split('T')[0];
  isSubmitting = signal(false);
  errorMessage = signal('');

  customerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    dateOfBirth: [new Date().toISOString().substring(0, 10), Validators.required],
    associationDate: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  calculateEligibility = computed(() => {
    const dateStr = this.customerForm.get('dateOfBirth')?.value as string | null;
    if (!dateStr) return 'NOT_ELIGIBLE';

    const dateOfB = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateOfB.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = diffDays / 365.25;

    return years >= 18 ? 'ELIGIBLE' : 'NOT_ELIGIBLE';
  });

  calculatedType = computed(() => {
    const dateStr = this.customerForm.get('associationDate')?.value;
    if (!dateStr) return 'REGULAR';

    const assocDate = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - assocDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = diffDays / 365.25;

    return years >= 3 ? 'PREMIUM' : 'REGULAR';
  });

  onSubmit() {
    if (this.customerForm.valid) {
      this.isSubmitting.set(true);

      this.customerService.createCustomer(this.customerForm.value as any).subscribe({
        next: (res) => {
          // 🔥 IMPORTANT CHANGE
          this.router.navigate(['/customers', res.data.id]);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to create customer');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/customers']);
  }
}

export default CustomerCreateComponent
