import { Component, computed, inject } from '@angular/core';
import { WishlistStore } from '../../../core/state/wishlist-store';
import { BigBasketApi } from '../../../core/api/big-basket-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCard } from '../../products/product-card/product-card';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ProductCard, RouterLink],
  selector: 'app-wishlist',
  styleUrl: './wishlist.css',
  templateUrl: './wishlist.html',
})
export class Wishlist {
  readonly wishlist = inject(WishlistStore);
  private readonly api = inject(BigBasketApi);
  private readonly productsResponse = toSignal(this.api.getProducts(), {
    initialValue: null,
  });

  readonly loading = computed(() => this.productsResponse() === null);
  readonly products = computed(() => {
    const products = this.productsResponse()?.data ?? [];

    return products.filter((product) => this.wishlist.has(product.productId));
  });
}
