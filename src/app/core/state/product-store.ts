import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ProductApi } from '../api/product-api';
import { Product } from '../models/product';
import { ProductUpsertRequest } from '../models/product-request';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly api = inject(ProductApi);

  private readonly productsState = signal<Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly products = this.productsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly count = computed(() => this.productsState().length);

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
      const products = await firstValueFrom(this.api.getAll());

      this.productsState.set(products);

      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(this.getErrorMessage(error, 'Products could not be loaded.'));
    } finally {
      this.loadingState.set(false);
    }
  }

  getById(id: number) {
    return this.productsState().find((product) => product.productId === id);
  }

  async create(request: ProductUpsertRequest): Promise<void> {
    try {
      await firstValueFrom(this.api.create(request));
      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be created.'));
    }
  }

  async update(id: number, request: ProductUpsertRequest) {
    try {
      await firstValueFrom(this.api.update(id, request));
      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be updated.'));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await firstValueFrom(this.api.delete(id));
      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be archived.'));
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
