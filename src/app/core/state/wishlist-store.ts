import { computed, effect, Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class WishlistStore {
  private readonly storageKey = 'serein-wishlist';

  private readonly idsState = signal<number[]>(this.load());
  readonly ids = this.idsState.asReadonly();

  readonly count = computed(() => this.idsState().length);
  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.idsState()));
    });
  }

  private load(): number[] {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  has(productId: number) {
    return this.idsState().includes(productId);
  }

  add(productId: number) {
    if (this.has(productId)) {
      return;
    }

    this.idsState.update((ids) => [...ids, productId]);
  }

  remove(productId: number) {
    this.idsState.update((ids) => ids.filter((id) => id !== productId));
  }

  toggle(productId: number) {
    if (this.has(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
  }

  clear() {
    this.idsState.set([]);
  }
}
