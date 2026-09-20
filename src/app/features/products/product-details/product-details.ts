import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CartStore } from '../../../core/state/cart-store';
import { WishlistStore } from '../../../core/state/wishlist-store';
import { ToastStore } from '../../../core/state/toast-store';
import { ProductStore } from '../../../core/state/product-store';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  // private readonly api = inject(BigBasketApi);
  private readonly route = inject(ActivatedRoute);
  private readonly productStore = inject(ProductStore);
  readonly wishlist = inject(WishlistStore);
  private readonly toast = inject(ToastStore);
  readonly cart = inject(CartStore);

  // private readonly productsResponse = toSignal(this.api.getProducts(), { initialValue: null });

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly productId = computed(() => Number(this.params().get('id')));

  readonly product = computed(() => this.productStore.getById(this.productId()));

  readonly loading = this.productStore.loading;

  constructor() {
    void this.productStore.load();
  }

  async addToCart() {
    const product = this.product();

    if (!product) {
      return;
    }

    try {
      await this.cart.add(product.productId);
      this.toast.show(`${product.productName} added to cart.`);
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'Could not add product to cart.',
        'error',
      );
    }
  }

  async toggleWishlist() {
    const product = this.product();
    if (!product) {
      return;
    }

    try {
      const saved = await this.wishlist.toggle(product.productId);
      this.toast.show(
        saved ? `${product.productName} saved.` : `${product.productName} removed from wishlist.`,
      );
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'wishlist could not be updated.',
        'error',
      );
    }
  }
}
