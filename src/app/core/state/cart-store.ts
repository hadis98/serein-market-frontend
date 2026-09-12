import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { CartApi } from '../api/cart-api';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly storageKey = 'serein-cart';
  private readonly itemsState = signal<CartItem[]>(this.loadCart());
  private readonly cartApi = inject(CartApi);

  readonly items = this.itemsState.asReadonly();
  readonly itemCount = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.itemsState().reduce((total, item) => total + item.product.productPrice * item.quantity, 0),
  );

  readonly isEmpty = computed(() => this.itemsState().length === 0);

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem(this.storageKey);
    if (!savedCart) {
      return [];
    }
    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  }

  constructor() {
    effect(() => localStorage.setItem(this.storageKey, JSON.stringify(this.itemsState())));
  }

  add(product: Product) {
    const existingItem = this.itemsState().find(
      (item) => item.product.productId === product.productId,
    );

    if (existingItem) {
      this.itemsState.update((items) =>
        items.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      return;
    }
    this.itemsState.update((items) => [...items, { product, quantity: 1 }]);
  }

  increase(productId: number) {
    this.itemsState.update((items) =>
      items.map((item) =>
        item.product.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  decrease(productId: number) {
    this.itemsState.update((items) =>
      items
        .map((item) =>
          item.product.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  remove(productId: number) {
    this.itemsState.update((items) => items.filter((item) => item.product.productId !== productId));
  }

  clear() {
    this.itemsState.set([]);
  }

  async syncToBackend(customerId: number) {
    await this.clearBackendCart(customerId);
    await this.addLocalItemsToBackend(customerId);
    await this.verifyBackendCart(customerId);
  }

  private async clearBackendCart(customerId: number): Promise<void> {
    const response = await firstValueFrom(this.cartApi.getByCustomerId(customerId));

    if (!response.result) {
      throw new Error(response.message || 'Could not load your server cart.');
    }

    for (const item of response.data ?? []) {
      const deleteResponse = await firstValueFrom(this.cartApi.delete(item.cartId));

      if (!deleteResponse.result) {
        throw new Error('Could not prepare your cart for checkout.');
      }
    }
  }

  private async addLocalItemsToBackend(customerId: number): Promise<void> {
    for (const item of this.items()) {
      const response = await firstValueFrom(
        this.cartApi.add({
          CartId: 0,
          CustId: customerId,
          ProductId: item.product.productId,
          Quantity: item.quantity,
          AddedDate: new Date().toISOString(),
        }),
      );

      if (!response.result) {
        throw new Error(`Could not add ${item.product.productName} to the server cart.`);
      }
    }
  }
  private async verifyBackendCart(customerId: number): Promise<void> {
    const response = await firstValueFrom(this.cartApi.getByCustomerId(customerId));

    if (!response.result) {
      throw new Error('Could not verify your cart before checkout.');
    }

    const backendItems = response.data ?? [];
    const localItems = this.items();

    if (backendItems.length !== localItems.length) {
      throw new Error('Your cart could not be synchronized. Please try again.');
    }

    const matches = localItems.every((localItem) => {
      const backendItem = backendItems.find(
        (item) => item.productId === localItem.product.productId,
      );

      return backendItem !== undefined && backendItem.quantity === localItem.quantity;
    });

    if (!matches) {
      throw new Error('Your cart could not be synchronized. Please try again.');
    }
  }
}
