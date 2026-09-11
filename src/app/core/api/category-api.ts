import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../models/api-response';
import { Category } from '../models/category';
import { CreateCategoryRequest } from '../models/create-category-request';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://freeapi.gerasim.in/api/BigBasket';

  getAll() {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/GetAllCategory`);
  }

  create(request: CreateCategoryRequest) {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/CreateNewCategory`, request);
  }

  delete(id: number) {
    return this.http.get<ApiResponse<null>>(`${this.baseUrl}/DeleteCategoryById`, {
      params: { id },
    });
  }
}
