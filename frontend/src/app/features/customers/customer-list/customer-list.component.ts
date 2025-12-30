import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CustomerService, Page } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Customers</h1>
        <a routerLink="/customers/new" class="btn btn-primary">
          <span class="icon">+</span> New Customer
        </a>
      </div>

      <!-- Search Filters -->
      <div class="card search-card">
        <div class="search-grid">
          <div class="form-group">
            <label>Search by Name</label>
            <input 
              type="text" 
              [formControl]="searchNameControl" 
              class="form-control" 
              placeholder="e.g. John Doe"
            >
          </div>
          <div class="form-group">
            <label>Search by Card Number</label>
            <input 
              type="text" 
              [formControl]="searchCardControl" 
              class="form-control" 
              placeholder="e.g. 4532..."
            >
          </div>
        </div>
      </div>

      <!-- Customer List -->
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assoc. Date</th>
                <th>Rewards</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let customer of customers()?.content">
                <td class="name-cell">
                  <a [routerLink]="['/customers', customer.id]">{{ customer.name }}</a>
                </td>
                <td>
                  <span class="badge" [ngClass]="customer.customerType.toLowerCase()">
                    {{ customer.customerType }}
                  </span>
                </td>
                <td>{{ customer.email }}</td>
                <td>{{ customer.phone }}</td>
                <td>{{ customer.associationDate | date }}</td>
                <td class="points">{{ customer.rewardBalance | number:'1.2-2' }}</td>
                <td class="actions">
                  <a [routerLink]="['/customers', customer.id]" class="btn-icon" title="View Profile">👁️</a>
                  <button class="btn-icon delete" (click)="deleteCustomer(customer)" title="Delete">🗑️</button>
                </td>
              </tr>
              
              <tr *ngIf="customers()?.content?.length === 0">
                <td colspan="7" class="empty-state">No customers found matching your criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-controls" *ngIf="customers() && customers()!.totalPages > 1">
          <button 
            [disabled]="customers()!.number === 0" 
            (click)="loadPage(customers()!.number - 1)"
            class="btn btn-secondary btn-sm"
          >Previous</button>
          
          <span class="page-info">
            Page {{ customers()!.number + 1 }} of {{ customers()!.totalPages }}
          </span>
          
          <button 
            [disabled]="customers()!.last" 
            (click)="loadPage(customers()!.number + 1)"
            class="btn btn-secondary btn-sm"
          >Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-card {
      margin-bottom: 2rem;
      padding: 1.5rem;
    }

    .search-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .name-cell a {
      font-weight: 600;
      color: var(--color-text-main);
      text-decoration: none;
    }
    
    .name-cell a:hover {
      color: var(--color-primary);
      text-decoration: underline;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge.regular {
      background-color: #e0e0e0;
      color: #555;
    }

    .badge.premium {
      background-color: var(--color-primary);
      color: white;
    }

    .points {
      font-family: monospace;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .btn-icon:hover {
      background-color: #f0f0f0;
    }

    .btn-icon.delete:hover {
      background-color: #ffebee;
    }

    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .page-info {
      font-size: 0.9rem;
      color: #666;
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

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #888;
    }
  `]
})
export class CustomerListComponent implements OnInit {
  customerService = inject(CustomerService);
  fb = inject(FormBuilder);

  customers = signal<Page<Customer> | null>(null);
  
  searchNameControl = this.fb.control('');
  searchCardControl = this.fb.control('');

  ngOnInit() {
    this.loadPage(0);
    this.setupSearch();
  }

  setupSearch() {
    this.searchNameControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(name => {
      if (name) {
        this.searchCardControl.setValue('', { emitEvent: false }); // Clear other search
        this.customerService.searchByName(name || '').subscribe(page => this.customers.set(page));
      } else {
        this.loadPage(0);
      }
    });

    this.searchCardControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(card => {
      if (card) {
        this.searchNameControl.setValue('', { emitEvent: false }); // Clear other search
        this.customerService.searchByCard(card || '').subscribe(page => this.customers.set(page));
      } else {
        this.loadPage(0);
      }
    });
  }

  loadPage(page: number) {
    // If searching, stay in search mode, otherwise load all
    const name = this.searchNameControl.value;
    const card = this.searchCardControl.value;

    if (name) {
      this.customerService.searchByName(name, page).subscribe(p => this.customers.set(p));
    } else if (card) {
      this.customerService.searchByCard(card, page).subscribe(p => this.customers.set(p));
    } else {
      this.customerService.getAllCustomers(page).subscribe(p => this.customers.set(p));
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete ${customer.name}? This will perform a soft delete.`)) {
      this.customerService.deleteCustomer(customer.id).subscribe(() => {
        this.loadPage(this.customers()?.number || 0);
      });
    }
  }
}
