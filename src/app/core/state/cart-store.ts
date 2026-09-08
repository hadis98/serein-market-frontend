import { computed, effect, Injectable, signal } from '@angular/core';

import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly storageKey = 'serein-cart';
  private readonly itemsState = signal<CartItem[]>(this.loadCart());

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
}
