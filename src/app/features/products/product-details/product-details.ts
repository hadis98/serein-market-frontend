import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BigBasketApi } from '../../../core/api/big-basket-api';
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

  addToCart() {
    const product = this.product();
    
    if (!product) {
      return;
    }
    this.cart.add(product);
    this.toast.show(`${product.productName} added to cart.`);
  }

  toggleWishlist() {
    const product = this.product();

    if (!product) {
      return;
    }

    const wasSaved = this.wishlist.has(product.productId);
    this.wishlist.toggle(product.productId);

    this.toast.show(wasSaved ? 'Removed from wishlist.' : 'Added to wishlist.');
  }
}
