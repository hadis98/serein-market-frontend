import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product, ProductStatus } from '../models/product';
import { ProductUpsertRequest } from '../models/product-request';
import { API_BASE_URL } from './api.config';
import { map } from 'rxjs';

interface BackendProduct {
  id: number;
  sku: string;
  name: string;
  slug: string;

  shortDescription: string | null;
  description: string;

  price: string | number;
  imageUrl: string;

  deliveryEstimate: string | null;
  stockQuantity: number;
  status: ProductStatus;

  category: {
    id: number;
    name: string;
    slug: string;
  };

  createdAt: string;
  updatedAt: string;
}

interface ProductListResponse {
  data: BackendProduct[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/products`;

  getAll() {
    return this.http
      .get<ProductListResponse>(this.baseUrl, {
        params: {
          limit: 100,
        },
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
