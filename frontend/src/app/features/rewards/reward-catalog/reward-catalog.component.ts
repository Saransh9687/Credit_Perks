import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RewardService } from '../../../core/services/reward.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-reward-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Reward Catalog</h1>
        <div class="cart-widget" *ngIf="customerId">
           <a [routerLink]="['/customers', customerId, 'cart']" class="btn btn-primary">
             🛒 View Cart
           </a>
        </div>
      </div>

      <div class="category-filters">
        <button
          class="filter-chip"
          [class.active]="!selectedCategory()"
          (click)="selectCategory(null)"
        >
          All
        </button>
        <button
          class="filter-chip"
          *ngFor="let cat of categories()"
          [class.active]="selectedCategory() === cat.id"
          (click)="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <div class="rewards-grid">
          <div class="reward-card" *ngFor="let item of rewards()">
             <div class="card-image-placeholder">
                <span style="font-size: 3rem;">🎁</span>
             </div>
             <div class="card-content">
                <h3>{{ item.name }}</h3>
                <p class="description">{{ item.description }}</p>
                <div class="price-row">
                   <span class="price-badge">{{ item.pointsCost }} pts</span>
                </div>

                <div class="action-row">
                   <button
                     class="btn btn-sm btn-primary add-btn"
                     (click)="addToCart(item)"
                     [disabled]="!customerId || isAlreadyInCart(item.id)"
                   >
                     {{ isAlreadyInCart(item.id) ? 'Added to Cart' : 'Add to Cart' }}
                   </button>
                </div>
             </div>
          </div>
       </div>

       <div class="toast" [class.show]="toastMessage()">{{ toastMessage() }}</div>
    </div>
  `,
  styles: [`
    /* ... existing styles ... */
    .add-btn:disabled {
      background-color: #ccc;
      border-color: #bbb;
      cursor: not-allowed;
    }
    /* Rest of your styles remain the same */
    .category-filters { display: flex; gap: 0.5rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem; }
    .filter-chip { padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid #ddd; background: white; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .filter-chip.active { background-color: var(--color-primary); color: white; border-color: var(--color-primary); }
    .rewards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .reward-card { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #eee; transition: transform 0.2s; }
    .reward-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .card-image-placeholder { height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .card-content { padding: 1rem; }
    .card-content h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; }
    .description { color: #666; font-size: 0.9rem; margin-bottom: 1rem; height: 40px; overflow: hidden; }
    .price-row { margin-bottom: 1rem; }
    .price-badge { background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.9rem; }
    .action-row { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    .add-btn { flex: 1; }
    .toast { position: fixed; bottom: 20px; right: 20px; background: #323232; color: white; padding: 12px 24px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 1000; }
    .toast.show { opacity: 1; }
  `]
})
export class RewardCatalogComponent implements OnInit {
  rewardService = inject(RewardService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);

  categories = signal<any[]>([]);
  rewards = signal<any[]>([]);
  selectedCategory = signal<number | null>(null);

  customerId: number | null = null;

  // NEW: Track IDs of items added to cart
  addedItemIds = signal<Set<number>>(new Set());

  quantities = signal<Record<number, number>>({});
  toastMessage = signal<string>('');
  toastTimeout: any;

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
       this.customerId = +params['id'];
       if (this.customerId) {
         this.loadCartStatus(); // Optional: Check what's already in the cart on load
       }
    });

    this.loadCategories();
    this.loadRewards(null);
  }

  // Optional: If your cart API allows fetching current items to sync the UI
  loadCartStatus() {
    this.cartService.getCart(this.customerId!).subscribe(cart => {
      const ids = new Set(cart.items.map((i: any) => i.rewardItem.id));
      this.addedItemIds.set(ids);
    });
  }

  loadCategories() {
    this.rewardService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  loadRewards(catId: number | null) {
     this.rewardService.getRewards(catId || undefined).subscribe(items => this.rewards.set(items));
  }

  selectCategory(id: number | null) {
     this.selectedCategory.set(id);
     this.loadRewards(id);
  }

  // NEW: Helper to check if item is disabled
  isAlreadyInCart(itemId: number): boolean {
    return this.addedItemIds().has(itemId);
  }

  getQuantity(itemId: number): number {
     return this.quantities()[itemId] || 1;
  }

  showToast(msg: string) {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastMessage.set(msg);
      this.toastTimeout = setTimeout(() => this.toastMessage.set(''), 3000);
  }

  addToCart(item: any) {
     if (!this.customerId) {
        this.showToast('Error: Customer ID missing');
        return;
     }

     const qty = this.getQuantity(item.id);

     this.cartService.addToCart({
        customerId: this.customerId,
        rewardItemId: item.id,
        quantity: qty
     }).subscribe({
        next: () => {
          this.showToast(`Added ${item.name} to cart`);
          // NEW: Add ID to the disabled set
          this.addedItemIds.update(set => {
            const newSet = new Set(set);
            newSet.add(item.id);
            return newSet;
          });
        },
        error: (err) => this.showToast('Failed to add: ' + (err.error?.message || 'Unknown error'))
     });
  }
}
