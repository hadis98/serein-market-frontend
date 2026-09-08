import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { BigBasketApi } from '../../../core/api/big-basket-api';
import { ProductCard } from '../product-card/product-card';

@Component({
  imports: [ProductCard],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {
  private readonly api = inject(BigBasketApi);
  private readonly route = inject(ActivatedRoute);

  private readonly productsResponse = toSignal(this.api.getProducts(), { initialValue: null });

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly products = computed(() => this.productsResponse()?.data ?? []);

  readonly selectedCategoryId = computed(() => {
    const category = this.queryParams().get('category');
    return category ? Number(category) : null;
  });

  readonly visibleProducts = computed(() => {
    const categoryId = this.selectedCategoryId();

    if (!categoryId) {
      return this.products();
    }
    return this.products().filter((product) => product.categoryId === categoryId);
  });

  readonly loading = computed(() => this.productsResponse() === null);
}
