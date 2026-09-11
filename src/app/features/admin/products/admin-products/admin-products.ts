import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { ProductStore } from '../../../../core/state/product-store';
import { ToastStore } from '../../../../core/state/toast-store';
import { Product } from '../../../../core/models/product';
import { RouterLink } from "@angular/router";

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-admin-products',
  styleUrl: './admin-products.css',
  templateUrl: './admin-products.html',
})
export class AdminProducts {
  readonly productStore = inject(ProductStore);
  private readonly toast = inject(ToastStore);
  readonly search = signal('');
  readonly pendingDelete = signal<Product | null>(null);
  readonly deleting = signal(false);

  readonly products = computed(() => {
    const search = this.search().trim().toLowerCase();
    const products = this.productStore.products();

    if (!search) {
      return products;
    }

    return products.filter((product) => product.productName.toLowerCase().includes(search));
  });

  constructor() {
    void this.productStore.load();
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }

  askToDelete(product: Product) {
    this.pendingDelete.set(product);
  }

  cancelDelete() {
    this.pendingDelete.set(null);
  }

  async confirmDelete() {
    const product = this.pendingDelete();

    if (!product) {
      return;
    }

    this.deleting.set(true);

    try {
      await this.productStore.delete(product.productId);

      this.pendingDelete.set(null);

      this.toast.show('Product deleted successfully.');
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'Product could not be deleted.',
        'error',
      );
    } finally {
      this.deleting.set(false);
    }
  }
}
