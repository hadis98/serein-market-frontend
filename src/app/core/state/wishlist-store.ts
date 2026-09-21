import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { WishlistApi } from '../api/wishlist-api';

import type { WishlistResponse } from '../models/wishlist.model';

import type { Product, ProductPreview } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistStore {
  private readonly api = inject(WishlistApi);

  private readonly wishlistState = signal<WishlistResponse | null>(null);

  private readonly loadingState = signal(false);

  private readonly loadedState = signal(false);

  readonly loading = this.loadingState.asReadonly();

  readonly items = computed(() => this.wishlistState()?.items ?? []);

  readonly count = computed(() => this.items().length);

  readonly isEmpty = computed(() => this.items().length === 0);

  async load(force = false): Promise<void> {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);

    try {
      const wishlist = await firstValueFrom(this.api.get());

      this.wishlistState.set(wishlist);

      this.loadedState.set(true);
    } finally {
      this.loadingState.set(false);
    }
  }

  isSaved(productId: number): boolean {
    return this.items().some((item) => item.product.productId === productId);
  }

  async add(productId: number): Promise<void> {
    try {
      const wishlist = await firstValueFrom(
        this.api.add({
          productId: productId,
        }),
      );

      this.wishlistState.set(wishlist);

      this.loadedState.set(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be saved.'));
    }
  }

  async remove(productId: number): Promise<void> {
    const item = this.items().find((item) => item.product.productId === productId);

    if (!item) {
      return;
    }

    try {
      const wishlist = await firstValueFrom(this.api.remove(item.wishlistItemId));

      this.wishlistState.set(wishlist);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be removed from wishlist.'));
    }
  }

  async toggle(productId: number): Promise<boolean> {
    if (this.isSaved(productId)) {
      await this.remove(productId);

      return false;
    }

    await this.add(productId);

    return true;
  }

  reset(): void {
    this.wishlistState.set(null);

    this.loadedState.set(false);
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const message = error.error?.message;

    return Array.isArray(message) ? message.join(', ') : (message ?? fallback);
  }
}
