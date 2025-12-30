import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RewardService } from '../../../core/services/reward.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-redemption-history',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  template: `
    <div class="container">
       <h2>Redemption History</h2>
       
       <div *ngIf="loading()" class="loading">Loading history...</div>
       
       <div *ngIf="!loading() && history().length === 0" class="empty-state">
          No redemptions found.
       </div>

       <div class="history-list" *ngIf="history().length > 0">
          <div class="history-card" *ngFor="let record of history()">
             <div class="header">
                <span class="date">{{ record.redeemedAt | date:'medium' }}</span>
                <span class="status badge-success">{{ record.status || 'COMPLETED' }}</span>
             </div>
             <div class="details">
                <div class="items">
                   <div class="item-row" *ngFor="let item of record.items">
                      <span>{{ item.quantity }}x {{ item.rewardItem?.name }}</span>
                      <span class="points">{{ item.pointsCost * item.quantity | number }} pts</span>
                   </div>
                </div>
                <div class="total-row">
                   <span>Total Redeemed:</span>
                   <span class="total-points">{{ record.totalPointsUsed | number }} pts</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  `,
  styles: [`
    .container { padding: 1rem 0; }
    .history-card { 
        border: 1px solid #eee; border-radius: 8px; margin-bottom: 1rem; 
        padding: 1rem; background: white;
    }
    .header { 
        display: flex; justify-content: space-between; margin-bottom: 1rem; 
        padding-bottom: 0.5rem; border-bottom: 1px dashed #eee;
    }
    .date { color: #666; font-size: 0.9rem; }
    .badge-success { 
        background: #e8f5e9; color: #2e7d32; 
        padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;
    }
    .item-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .total-row { 
        display: flex; justify-content: space-between; margin-top: 1rem; 
        font-weight: bold; font-size: 1.1rem; border-top: 1px solid #eee; padding-top: 0.5rem;
    }
    .total-points { color: #d32f2f; }
  `]
})
export class RedemptionHistoryComponent implements OnInit {
  rewardService = inject(RewardService);
  route = inject(ActivatedRoute);
  
  history = signal<any[]>([]);
  loading = signal(true);
  
  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
       const customerId = +params['id'];
       if (customerId) {
          this.loadHistory(customerId);
       }
    });
  }
  
  loadHistory(id: number) {
     this.rewardService.getRedemptionHistory(id).subscribe({
        next: (data) => {
           this.history.set(data);
           this.loading.set(false);
        },
        error: (err) => {
           console.error('Failed to load history', err);
           this.loading.set(false);
        }
     });
  }
}
