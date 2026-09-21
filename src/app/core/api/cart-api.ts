import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {
  AddCartItemRequest,
  BackendCartResponse,
  CartResponse,
  UpdateCartItemRequest,
} from '../models/cart.model';
import { API_BASE_URL } from './api.config';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/cart`;

  get() {
    return this.http.get<BackendCartResponse>(this.baseUrl).pipe(map((cart) => this.toCart(cart)));
  }

  add(request: AddCartItemRequest) {
    return this.http
      .post<BackendCartResponse>(`${this.baseUrl}/items`, request)
      .pipe(map((cart) => this.toCart(cart)));
  }

  update(itemId: number, request: UpdateCartItemRequest) {
    return this.http
      .patch<BackendCartResponse>(`${this.baseUrl}/items/${itemId}`, request)
      .pipe(map((cart) => this.toCart(cart)));
  }

  remove(itemId: number) {
    return this.http
      .delete<BackendCartResponse>(`${this.baseUrl}/items/${itemId}`)
      .pipe(map((cart) => this.toCart(cart)));
  }

  
  private toCart(cart: BackendCartResponse): CartResponse {
    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        cartItemId: item.id,
        quantity: item.quantity,
        lineTotal: Number(item.lineTotal),
        product: {
          productId: item.product.id,
          productSku: item.product.sku,
          productName: item.product.name,
          productPrice: Number(item.product.price),
          productImageUrl: item.product.imageUrl,
          stockQuantity: item.product.stockQuantity,
          status: item.product.status,
        },
      })),
      summary: {
        totalQuantity: cart.summary.totalQuantity,
        subtotal: Number(cart.summary.subtotal),
      },
    };
  }
}
