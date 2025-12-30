import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Cart, CartItem } from '../../../core/services/cart.service';
import { RewardService } from '../../../core/services/reward.service';
import { RewardBalanceResponse } from '../../../core/models/reward.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" *ngIf="cart()">
      <div class="page-header">
        <h1 class="page-title" *ngIf="cart()">Shopping Cart</h1>
      </div>

      <div class="balance-banner" *ngIf="rewardBalance()">
         <span>Available Balance: <strong>{{ rewardBalance()!.pointsBalance | number:'1.2-2' }} pts</strong></span>
      </div>

    <div class="cart-container">
          <div class="cart-items card">
             <div class="cart-item" *ngFor="let item of cart()!.items">
                <div class="item-info">
                   <h3>{{ item.rewardItemName }}</h3>
                   <div class="price-qty-row">
                       <span>Cost: {{ item.pointsCost }} pts</span>
                       <div class="quantity-controls">
                           <button class="btn-qty" (click)="updateQuantity(item, -1)" [disabled]="item.quantity <= 1 && false">-</button>
                           <span class="qty-val">{{ item.quantity }}</span>
                           <button class="btn-qty" (click)="updateQuantity(item, 1)">+</button>
                           <button class="btn-remove" (click)="updateQuantity(item, -item.quantity)">Remove</button>
                       </div>
                   </div>
                </div>
                <div class="item-total">
                   {{ item.totalPoints }} pts
                </div>
             </div>

             <div *ngIf="cart()!.items.length === 0" class="empty-cart">
                <p>Your cart is empty.</p>
                <a [routerLink]="['../catalog']" class="btn btn-primary">Browse Rewards</a>
             </div>
          </div>

          <div class="cart-summary card" *ngIf="cart()!.items.length > 0">
             <h3>Summary</h3>
             <div class="summary-row total">
                <span>Total Points:</span>
                <span>{{ cart()!.totalPoints }}</span>
             </div>

             <div class="payment-method">
                <label>Redeem from Card:</label>
                <select [ngModel]="selectedCardId()" (ngModelChange)="selectCard($event)">
                    <option [ngValue]="null" disabled>Select a Credit Card</option>
                    <option *ngFor="let card of rewardBalance()?.cardRewards" [ngValue]="card.creditCardId">
                        {{ card.cardNumber }} ({{ card.points | number:'1.0-0' }} pts)
                    </option>
                </select>
             </div>

             <button
                class="btn btn-primary full-width"
                (click)="redeem()"
                [disabled]="isRedeeming() || !canAfford() || !selectedCardId()"
                [class.btn-error]="!canAfford() && selectedCardId()"
             >
                {{ getButtonText() }}
             </button>
             <p *ngIf="error()" class="error-msg">{{ error() }}</p>
          </div>
       </div>
     </div>
   `,
   styles: [`
     .cart-container { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
     .cart-item { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #eee; }
     .cart-item:last-child { border-bottom: none; }
     .item-total { font-weight: bold; font-size: 1.1rem; }
     .empty-cart { text-align: center; padding: 3rem; }
     .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; }
     .summary-row.total { font-weight: 800; font-size: 1.2rem; border-top: 1px solid #eee; padding-top: 1rem; }
     .full-width { width: 100%; margin-top: 1rem; }
     .error-msg { color: var(--color-error); margin-top: 1rem; text-align: center; }
     .balance-banner { background: #e3f2fd; color: #1976d2; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: right; }
     .btn-error { background-color: #ef5350 !important; cursor: not-allowed; }

     .payment-method { margin-top: 1.5rem; }
     .payment-method label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
     .payment-method select { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }

     .price-qty-row { display: flex; gap: 2rem; align-items: center; margin-top: 0.5rem; }
     .quantity-controls { display: flex; align-items: center; gap: 0.5rem; background: #f5f5f5; padding: 4px; border-radius: 4px; }
     .btn-qty { border: none; background: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-weight: bold; }
     .btn-qty:hover { background: #eee; }
     .qty-val { font-weight: bold; min-width: 20px; text-align: center; }
     .btn-remove { border: none; background: none; color: #d32f2f; font-size: 0.8rem; cursor: pointer; margin-left: 0.5rem; text-decoration: underline; }
   `]
 })
 export class CartComponent implements OnInit {
   cartService = inject(CartService);
   rewardService = inject(RewardService);
   route = inject(ActivatedRoute);
   router = inject(Router);

   cart = signal<Cart | null>(null);
   customerId: number | null = null;
   rewardBalance = signal<RewardBalanceResponse | null>(null);

   selectedCardId = signal<number | null>(null);
   isRedeeming = signal(false);
   error = signal('');

   canAfford = () => {
       const cardId = this.selectedCardId();
       if (!cardId || !this.rewardBalance()) return false;

       const card = this.rewardBalance()!.cardRewards?.find(c => c.creditCardId == cardId);
       const balance = card?.points || 0;
       const cost = this.cart()?.totalPoints || 0;
       return balance >= cost;
   };

   ngOnInit() {
     this.route.parent?.params.subscribe(params => {
        this.customerId = +params['id'];
        if (this.customerId) {
           this.loadCart(this.customerId);
           this.rewardService.getRewardBalance(this.customerId).subscribe(b => {
               this.rewardBalance.set(b);
               if (b.cardRewards && b.cardRewards.length > 0) {
                   this.selectedCardId.set(b.cardRewards[0].creditCardId);
               }
           });
        }
     });
   }

   loadCart(id: number) {
      this.cartService.getCart(id).subscribe(c => this.cart.set(c));
   }

   updateQuantity(item: CartItem, change: number) {
       if (!this.customerId) return;
       const newQty = item.quantity + change;
       this.cartService.updateCartItemQuantity(item.id, newQty).subscribe(() => {
           this.loadCart(this.customerId!);
       });
   }

   selectCard(id: number) {
       this.selectedCardId.set(id);
   }

   getButtonText(): string {
       if (this.isRedeeming()) return 'Redeeming...';
       if (!this.selectedCardId()) return 'Select a Card';
       if (!this.canAfford()) return 'Insufficient reward points on this Card';
       return 'Redeem Now';
   }

   redeem() {
      if (!this.customerId || !this.selectedCardId()) return;
      this.isRedeeming.set(true);
      this.error.set('');

      this.cartService.redeemCart(this.customerId, this.selectedCardId()!).subscribe({
         next: (res) => {
            alert('Redemption Successful!');
            this.router.navigate(['../'], { relativeTo: this.route });
         },
         error: (err) => {
            this.isRedeeming.set(false);
            this.error.set(err.error?.message || 'Redemption failed.');
         }
      });
   }
 }
