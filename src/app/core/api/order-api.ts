import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';
import { PlaceOrderRequest } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://freeapi.gerasim.in/api/BigBasket';
  
  placeOrder(request: PlaceOrderRequest) {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/PlaceOrder`, request);
  }

  cancelOrder(saleId: number) {
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/cancelOrder`, {
      params: {
        saleId,
      },
    });
  }
}
