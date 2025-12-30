import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RewardBalanceResponse } from '../models/reward.model';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/rewards';

  getRewardBalance(customerId: number): Observable<RewardBalanceResponse> {
    return this.http.get<RewardBalanceResponse>(`${this.API_URL}/balance/${customerId}`);
  }

  processTransactions(customerId: number): Observable<RewardBalanceResponse> {
    return this.http.post<RewardBalanceResponse>(`${this.API_URL}/process/${customerId}`, {});
  }

  processTransactionsByCard(cardId: number): Observable<RewardBalanceResponse> {
    return this.http.post<RewardBalanceResponse>(`${this.API_URL}/process/card/${cardId}`, {});
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/catalog/categories`);
  }

  getRewards(categoryId?: number): Observable<any[]> {
    const url = categoryId
      ? `${this.API_URL}/catalog/category/${categoryId}`
      : `${this.API_URL}/catalog/items`;
    return this.http.get<any[]>(url);
  }

  getRedemptionHistory(customerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/history/${customerId}`);
  }
}
