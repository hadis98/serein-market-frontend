import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { CategoryApi } from '../api/category-api';

import type { Category, CategoryDetails } from '../models/category.model';

import type { CreateCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryStore {
  private readonly api = inject(CategoryApi);

  private readonly categoriesState = signal<Category[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly categories = this.categoriesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly count = computed(() => this.categoriesState().length);

  async load(force = false): Promise<void> {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const categories = await firstValueFrom(this.api.getAll());

      this.categoriesState.set(categories);

      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(this.getErrorMessage(error, 'Categories could not be loaded.'));
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadById(id: number): Promise<CategoryDetails> {
    try {
      return await firstValueFrom(this.api.getById(id));
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Category could not be loaded.'));
    }
  }

  async create(request: CreateCategoryRequest): Promise<void> {
    try {
      await firstValueFrom(this.api.create(request));

      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Category could not be created.'));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await firstValueFrom(this.api.delete(id));

      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Category could not be deleted.'));
    }
  }

  async update(id: number, request: Partial<CreateCategoryRequest>) {
    try {
      await firstValueFrom(this.api.update(id, request));
      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Category could not be updated.'));
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const message = error.error?.message;

    return Array.isArray(message) ? message.join(', ') : (message ?? fallback);
  }
}
