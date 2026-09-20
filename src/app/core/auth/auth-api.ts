import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { API_BASE_URL } from '../api/api.config';

import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/auth`;

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request);
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  me() {
    return this.http.get<AuthUser>(`${this.baseUrl}/me`);
  }
}
