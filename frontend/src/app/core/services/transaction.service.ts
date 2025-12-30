import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, GenerateTransactionsRequest } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/transactions';

  generateTransactions(request: GenerateTransactionsRequest): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.API_URL}/generate`, request);
  }

  getTransactionsByCard(cardId: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/card/${cardId}?page=${page}&size=${size}`);
  }
}
