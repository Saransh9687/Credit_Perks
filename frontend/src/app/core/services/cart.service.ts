import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  id: number;
  rewardItemName: string;
  quantity: number;
  pointsCost: number;
  totalPoints: number;
}

export interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
  totalPoints: number;
}

export interface AddToCartRequest {
  customerId: number;
  rewardItemId: number;
  quantity: number;
}

export interface RedemptionResponse {
  redemptionId: number;
  status: string;
  totalPointsUsed: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/cart';

  getCart(customerId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.API_URL}/${customerId}`);
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.API_URL}/add`, request);
  }

  redeemCart(customerId: number, creditCardId: number): Observable<RedemptionResponse> {
    return this.http.post<RedemptionResponse>(`${this.API_URL}/${customerId}/redeem?creditCardId=${creditCardId}`, {});
  }

  updateCartItemQuantity(itemId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/items/${itemId}?quantity=${quantity}`, {});
  }
}
