import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ProductApi } from '../api/product-api';
import { Product } from '../models/product';
import { ProductUpsertRequest } from '../models/product-request';

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
        throw new Error(response.message || 'Products could not be loaded.');
      }
      this.productsState.set(response.data ?? []);
      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Products could not be loaded.');
    } finally {
      this.loadingState.set(false);
    }
  }

  getById(id: number) {
    return this.productsState().find((product) => product.productId === id);
  }

  async create(request: ProductUpsertRequest) {
    const response = await firstValueFrom(this.api.create(request));

    if (!response.result) {
      throw new Error(response.message || 'Product could not be created.');
    }
    await this.load(true);
  }

  async update(request: ProductUpsertRequest) {
    const response = await firstValueFrom(this.api.update(request));

    if (!response.result) {
      throw new Error(response.message || 'Product could not be updated.');
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
    if (message?.includes('FK_EcomCart_EcomProduct')) {
      return (
        'This product cannot be deleted because ' +
        'it is currently used in one or more customer carts.'
      );
    }
    return message || 'Product could not be deleted.';
  }
}
