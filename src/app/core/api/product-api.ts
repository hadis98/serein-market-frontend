import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';
import { Product } from '../models/product';
import { ProductUpsertRequest } from '../models/product-request';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://freeapi.gerasim.in/api/BigBasket';

  getAll() {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/GetAllProducts`);
  }

  create(request: ProductUpsertRequest) {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/CreateProduct`, request);
  }

  update(request: ProductUpsertRequest) {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/UpdateProduct`, request);
  }

  delete(id: number) {
    return this.http.get<ApiResponse<null>>(`${this.baseUrl}/DeleteProductById`, {
      params: { id },
    });
  }
}
