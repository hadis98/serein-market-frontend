import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product, ProductPreview } from '../../../core/models/product';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../core/state/cart-store';
import { WishlistStore } from '../../../core/state/wishlist-store';
import { ToastStore } from '../../../core/state/toast-store';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<ProductPreview>();

  readonly wishlist = inject(WishlistStore);
  private readonly toast = inject(ToastStore);
  readonly cart = inject(CartStore);

  readonly saved = computed(() => this.wishlist.isSaved(this.product().productId));
  readonly isInStock = computed(() => this.product().stockQuantity > 0);

  async addToCart(): Promise<void> {
    const product = this.product();

    if (product.stockQuantity <= 0) {
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
