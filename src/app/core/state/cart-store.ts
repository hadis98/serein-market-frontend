import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { Product } from '../models/product';
import { CartItem, CartResponse } from '../models/cart-item';
import { CartApi } from '../api/cart-api';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly api = inject(CartApi);

  private readonly cartState = signal<CartResponse | null>(null);

  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);

  readonly loading = this.loadingState.asReadonly();

  readonly items = computed(() => this.cartState()?.items ?? []);

  readonly itemCount = computed(() => this.cartState()?.summary.totalQuantity ?? 0);

  readonly subTotal = computed(() => this.cartState()?.summary.subtotal ?? 0);

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
      const cart = await firstValueFrom(this.api.get());
      this.cartState.set(cart);
      this.loadedState.set(true);
    } finally {
      this.loadingState.set(false);
    }
  }

  async add(productId: number): Promise<void> {
    try {
      const cart = await firstValueFrom(
        this.api.add({
          productId: productId,
          quantity: 1,
        }),
      );

      this.cartState.set(cart);
      this.loadedState.set(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be added to cart.'));
    }
  }

  async increase(productId: number): Promise<void> {
    const item = this.items().find((item) => item.product.productId === productId);

    if (!item) {
      return;
    }

    await this.updateQuantity(item.cartItemId, item.quantity + 1);
  }

  async decrease(productId: number) {
    const item = this.items().find((item) => item.product.productId === productId);

    if (!item) {
      return;
    }

    if (item.quantity === 1) {
      await this.remove(productId);

      return;
    }

    await this.updateQuantity(item.cartItemId, item.quantity - 1);
  }

  async remove(productId: number): Promise<void> {
    const item = this.items().find((item) => item.product.productId === productId);
    if (!item) {
      return;
    }

    try {
      const cart = await firstValueFrom(this.api.remove(item.cartItemId));

      this.cartState.set(cart);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Product could not be removed from cart.'));
    }
  }

  reset(): void {
    this.cartState.set(null);
    this.loadedState.set(false);
  }

  private async updateQuantity(itemId: number, quantity: number) {
    try {
      const cart = await firstValueFrom(
        this.api.update(itemId, {
          quantity,
        }),
      );

      this.cartState.set(cart);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Cart quantity could not be updated.'));
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
