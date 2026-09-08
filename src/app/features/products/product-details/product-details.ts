import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BigBasketApi } from '../../../core/api/big-basket-api';
import { CartStore } from '../../../core/state/cart-store';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly api = inject(BigBasketApi);
  private readonly route = inject(ActivatedRoute);
  readonly cart = inject(CartStore);

  private readonly productsResponse = toSignal(this.api.getProducts(), { initialValue: null });

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly productId = computed(() => Number(this.params().get('id')));

  readonly product = computed(() =>
    this.productsResponse()?.data.find((product) => product.productId === this.productId()),
  );

  readonly loading = computed(() => this.productsResponse() === null);
  addToCart() {
    const product = this.product();

    if (product) {
      this.cart.add(product);
    }
  }
}
