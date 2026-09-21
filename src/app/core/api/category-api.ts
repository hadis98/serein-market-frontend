import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BackendCategory, CreateCategoryRequest } from '../models/category.model';
import { API_BASE_URL } from './api.config';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/categories`;

  getAll() {
    return this.http.get<BackendCategory[]>(this.baseUrl).pipe(
      map((categories) =>
        categories.map((category) => ({
          categoryId: category.id,
          categoryName: category.name,
          categorySlug: category.slug,
          categoryImageUrl: category.imageUrl,
          parentCategoryId: category.parentId,
        })),
      ),
    );
  }

  create(request: CreateCategoryRequest) {
    return this.http.post<BackendCategory>(this.baseUrl, request);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
