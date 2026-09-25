import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BackendProduct,
  Product,
  ProductListResponse,
  ProductStatus,
} from '../models/product.model';
import { ProductUpsertRequest } from '../models/product.model';
import { API_BASE_URL } from './api.config';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/products`;

  getAll(filters: { categoryId?: number } = {}) {
    const params: Record<string, string | number> = {
      limit: 100,
    };
    
    if (filters.categoryId !== undefined) {
      params['categoryId'] = filters.categoryId;
    }

    return this.http
      .get<ProductListResponse>(this.baseUrl, {
        params,
      })
      .pipe(map((response) => response.data.map((product) => this.toProduct(product))));
  }

  getById(id: number) {
    return this.http
      .get<BackendProduct>(`${this.baseUrl}/${id}`)
      .pipe(map((product) => this.toProduct(product)));
  }

  create(request: ProductUpsertRequest) {
    return this.http
      .post<BackendProduct>(this.baseUrl, request)
      .pipe(map((product) => this.toProduct(product)));
  }

  update(id: number, request: ProductUpsertRequest) {
    return this.http
      .patch<BackendProduct>(`${this.baseUrl}/${id}`, request)
      .pipe(map((product) => this.toProduct(product)));
  }

  delete(id: number) {
    return this.http.delete<{
      message: string;
      product: {
        id: number;
        name: string;
        status: ProductStatus;
      };
    }>(`${this.baseUrl}/${id}`);
  }

  private toProduct(product: BackendProduct): Product {
    return {
      productId: product.id,

      productSku: product.sku,

      productName: product.name,

      productPrice: Number(product.price),

      productShortDescription: product.shortDescription ?? '',

      productDescription: product.description,

      createdDate: product.createdAt,

      deliveryTimeSpan: product.deliveryEstimate ?? '',

      categoryId: product.category.id,

      productImageUrl: product.imageUrl,

      categoryName: product.category.name,

      stockQuantity: product.stockQuantity,

      status: product.status,

      slug: product.slug,
    };
  }
}
