import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product, ProductPreview } from '../../../core/models/product.model';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../../core/state/cart-store';
import { WishlistStore } from '../../../core/state/wishlist-store';
import { ToastStore } from '../../../core/state/toast-store';
import { AuthStore } from '../../../core/auth/auth-store';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  imports: [CurrencyPipe, RouterLink, Icon],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<ProductPreview>();

  readonly wishlist = inject(WishlistStore);
  private readonly toast = inject(ToastStore);
  readonly cart = inject(CartStore);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly saved = computed(() => this.wishlist.isSaved(this.product().productId));
  readonly isInStock = computed(() => this.product().stockQuantity > 0);

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

  async addToCart(): Promise<void> {
    const product = this.product();

    if (product.stockQuantity <= 0) {
      return;
    }

    const canContinue = await this.requireLogin('Please sign in to add items to your cart.');
    if (!canContinue) {
      return;
    }

    try {
      await this.cart.add(product.productId);

      this.toast.show(`${product.productName} added to cart`);
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'could not add product to cart',
        'error',
      );
    }
  }

  async toggleWishlist(): Promise<void> {
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

    if (!this.auth.isLoggedIn()) {
      this.toast.show('Please sign in to save products to your wishlist.', 'info');

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
