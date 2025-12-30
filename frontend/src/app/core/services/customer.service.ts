import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  associationDate: string;
}

// ✅ API Response wrapper
export interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/customers';

  getAllCustomers(page: number = 0, size: number = 20): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Customer>>(this.API_URL, { params });
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}/${id}`);
  }

  // ⬇️ ⬇️ UPDATED METHOD
  createCustomer(customer: CreateCustomerRequest): Observable<ApiResponse<Customer>> {
    return this.http.post<ApiResponse<Customer>>(this.API_URL, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  searchByName(name: string, page: number = 0, size: number = 20): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Customer>>(`${this.API_URL}/search/name`, { params });
  }

  searchByCard(cardNumber: string, page: number = 0, size: number = 20): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('cardNumber', cardNumber)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Customer>>(`${this.API_URL}/search/card`, { params });
  }
}
