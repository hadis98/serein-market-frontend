import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class BigBasketApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://freeapi.gerasim.in/api/BigBasket';

  getProducts() {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/GetAllProducts`);
  }

  getCategories() {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/GetAllCategory`);
  }
}
