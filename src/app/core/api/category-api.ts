import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BackendCategory,
  BackendCategoryDetails,
  Category,
  CategoryDetails,
  CreateCategoryRequest,
} from '../models/category.model';
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
          productCount: category._count.products,
          childCount: category._count.children,
        })),
      ),
    );
  }

  getById(id: number) {
    return this.http
      .get<BackendCategoryDetails>(`${this.baseUrl}/${id}`)
      .pipe(map((category) => this.toDetails(category)));
  }

  create(request: CreateCategoryRequest) {
    return this.http.post<BackendCategory>(this.baseUrl, request);
  }

  update(id: number, request: Partial<CreateCategoryRequest>) {
    return this.http.patch<BackendCategory>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  private toCategory(category: BackendCategory): Category {
    return {
      categoryId: category.id,
      categoryName: category.name,
      categoryImageUrl: category.imageUrl,
      categorySlug: category.slug,
      parentCategoryId: category.parentId,
      productCount: category._count.products,
      childCount: category._count.children,
    };
  }

  private toDetails(category: BackendCategoryDetails): CategoryDetails {
    return {
      ...this.toCategory(category),
      parentCategory: category.parent
        ? {
            categoryId: category.parent.id,
            categoryName: category.parent.name,
            categorySlug: category.parent.slug,
          }
        : null,
      productCount: category._count.products,
      childCount: category._count.children,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
