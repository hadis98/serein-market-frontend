import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BigBasketApi } from '../../../core/api/big-basket-api';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly api = inject(BigBasketApi);

  private readonly productsResponse = toSignal(this.api.getProducts(), { initialValue: null });
  private readonly categoriesResponse = toSignal(this.api.getCategories(), {
    initialValue: null,
  });

  readonly productCount = computed(() => this.productsResponse()?.data.length ?? 0);
  readonly categoryCount = computed(() => this.categoriesResponse()?.data.length ?? 0);
}
