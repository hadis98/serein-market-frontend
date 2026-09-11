import { computed, inject, Injectable, signal } from '@angular/core';
import { CategoryApi } from '../api/category-api';
import { Category } from '../models/category';
import { firstValueFrom } from 'rxjs';
import { CreateCategoryRequest } from '../models/create-category-request';

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

  async load(force = false) {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const response = await firstValueFrom(this.api.getAll());

      if (!response.result) {
        throw new Error(response.message || 'Categories could not be loaded.');
      }

      this.categoriesState.set(response.data ?? []);

      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : 'Categories could not be loaded.',
      );
    } finally {
      this.loadingState.set(false);
    }
  }

  async create(request: CreateCategoryRequest) {
    const response = await firstValueFrom(this.api.create(request));

    if (!response.result) {
      throw new Error(response.message || 'Category could not be created.');
    }

    await this.load(true);
  }

  async delete(id: number) {
    const response = await firstValueFrom(this.api.delete(id));

    if (!response.result) {
      throw new Error(this.getDeleteErrorMessage(response.message));
    }

    await this.load(true);
  }

  private getDeleteErrorMessage(message: string) {
    if (
      message?.toLowerCase().includes('reference constraint') ||
      message?.toLowerCase().includes('foreign key')
    ) {
      return 'This category cannot be deleted because ' + 'one or more products currently use it.';
    }

    return message || 'Category could not be deleted.';
  }
}
