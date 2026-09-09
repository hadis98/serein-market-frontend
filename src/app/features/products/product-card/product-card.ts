import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../../core/models/product';
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
  readonly product = input.required<Product>();

  readonly wishlist = inject(WishlistStore);
  private readonly toast = inject(ToastStore);
  readonly cart = inject(CartStore);

  addToCart() {
    const product = this.product();
    this.cart.add(product);

    this.toast.show(`${product.productName} added to cart`);
  }

  toggleWishlist() {
    const product = this.product();

    const wasSaved = this.wishlist.has(product.productId);
    this.wishlist.toggle(product.productId);
    this.toast.show(wasSaved ? 'Removed from wishlist.' : 'Added to wishlist');
  }
}
