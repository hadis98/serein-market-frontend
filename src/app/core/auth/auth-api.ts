import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';

import { LoginCustomerDto, LoginRequest, RegisterCustomerRequest , UpdateProfileRequest} from '../models/customer';

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

  updateProfile(request: UpdateProfileRequest){
    return this.http.put<ApiResponse<string>>(`${this.baseurl}/UpdateProfile`, request);
  }
}
