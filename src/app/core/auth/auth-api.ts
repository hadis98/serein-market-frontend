import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';

import { LoginCustomerDto, LoginRequest, RegisterCustomerRequest } from '../models/customer';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseurl = 'https://freeapi.gerasim.in/api/BigBasket';

  register(request: RegisterCustomerRequest) {
    return this.http.post<ApiResponse<unknown>>(`${this.baseurl}/RegisterCustomer`, request);
  }

  login(request: LoginRequest) {
    return this.http.post<ApiResponse<LoginCustomerDto>>(`${this.baseurl}/Login`, request);
  }
}
