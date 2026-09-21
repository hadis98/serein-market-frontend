import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { map } from 'rxjs';

import { API_BASE_URL } from './api.config';

import type { ProductStatus } from '../models/product.model';

import type {
  AddWishlistItemRequest,
  BackendWishlistResponse,
  WishlistResponse,
} from '../models/wishlist.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/wishlist`;
  get() {
    return this.http
      .get<BackendWishlistResponse>(this.baseUrl)
      .pipe(map((wishlist) => this.toWishlist(wishlist)));
  }

  add(request: AddWishlistItemRequest) {
    return this.http
      .post<BackendWishlistResponse>(`${this.baseUrl}/items`, request)
      .pipe(map((wishlist) => this.toWishlist(wishlist)));
  }

  remove(wishlistItemId: number) {
    return this.http
      .delete<BackendWishlistResponse>(`${this.baseUrl}/items/${wishlistItemId}`)
      .pipe(map((wishlist) => this.toWishlist(wishlist)));
  }

  private toWishlist(wishlist: BackendWishlistResponse): WishlistResponse {
    return {
      id: wishlist.id,

      items: wishlist.items.map((item) => ({
        wishlistItemId: item.id,

        createdAt: item.createdAt,

        product: {
          productId: item.product.id,
          productSku: item.product.sku,
          productName: item.product.name,
          productPrice: Number(item.product.price),
          productShortDescription: item.product.shortDescription,
          slug: item.product.slug,
          productImageUrl: item.product.imageUrl,
          stockQuantity: item.product.stockQuantity,
          status: item.product.status,
          categoryId: item.product.category.id,
          categoryName: item.product.category.name,
        },
      })),
    };
  }
}
