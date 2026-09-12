import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ApiResponse } from '../models/api-response';
import { AddToCartRequest, BackendCartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://freeapi.gerasim.in/api/BigBasket';

  getByCustomerId(customerId: number) {
    return this.http.get<ApiResponse<BackendCartItem[]>>(
      `${this.baseUrl}/GetCartProductsByCustomerId`,
      {
        params: {
          id: customerId,
        },
      },
    );
  }

  add(request: AddToCartRequest) {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/AddToCart`, request);
  }

  delete(cartId: number) {
    return this.http.get<ApiResponse<null>>(`${this.baseUrl}/DeleteProductFromCartById`, {
      params: {
        id: cartId,
      },
    });
  }
}
