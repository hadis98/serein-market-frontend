import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CartStore } from '../../../core/state/cart-store';
import { WishlistStore } from '../../../core/state/wishlist-store';
import { ToastStore } from '../../../core/state/toast-store';
import { ProductStore } from '../../../core/state/product-store';
import { AuthStore } from '../../../core/auth/auth-store';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productStore = inject(ProductStore);
  readonly wishlist = inject(WishlistStore);
  private readonly toast = inject(ToastStore);
  readonly cart = inject(CartStore);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly productId = computed(() => Number(this.params().get('id')));

  readonly product = computed(() => this.productStore.getById(this.productId()));

  readonly loading = this.productStore.loading;

  constructor() {
    void this.productStore.load();
  }

  private async requireLogin(message: string): Promise<boolean> {
    if (this.auth.isLoggedIn()) {
      return true;
    }

    this.toast.show(message, 'info');

    await this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: this.router.url,
      },
    });

    return false;
  }

  async addToCart() {
    const product = this.product();

    if (!product) {
      return;
    }

    const canContinue = await this.requireLogin('Please sign in to add items to your cart.');
    if (!canContinue) {
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

    const canContinue = await this.requireLogin(
      'Please sign in to save products to your wishlist.',
    );
    if (!canContinue) {
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
