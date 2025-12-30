import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditCard, AddCreditCardRequest } from '../models/credit-card.model';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/credit-cards';

  addCreditCard(request: AddCreditCardRequest): Observable<CreditCard> {
    return this.http.post<CreditCard>(this.API_URL, request);
  }

  getCustomerCards(customerId: number): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(`${this.API_URL}/customer/${customerId}`);
  }
}
