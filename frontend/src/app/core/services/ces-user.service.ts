import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CesUser, CreateCesUserRequest } from '../models/ces-user.model';

@Injectable({
  providedIn: 'root'
})
export class CesUserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/ces-users';

  getAllUsers(): Observable<CesUser[]> {
    return this.http.get<CesUser[]>(this.API_URL);
  }

  createUser(user: CreateCesUserRequest): Observable<CesUser> {
    return this.http.post<CesUser>(this.API_URL, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
