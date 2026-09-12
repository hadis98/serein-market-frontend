import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';
import { CustomerApiDto } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://freeapi.gerasim.in/api/BigBasket';

  getAll() {
    return this.http.get<ApiResponse<CustomerApiDto[]>>(`${this.baseUrl}/GetAllCustomer`);
  }

  getById(id: number) {
    return this.http.get<ApiResponse<CustomerApiDto>>(`${this.baseUrl}/GetCustomerById`, {
      params: { id },
    });
  }
}
