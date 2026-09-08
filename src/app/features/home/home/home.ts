import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { BigBasketApi } from '../../../core/api/big-basket-api';
import { CategoryCard } from '../../categories/category-card/category-card';
import { ProductCard } from '../../products/product-card/product-card';

@Component({
  imports: [RouterLink, CategoryCard, ProductCard],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly api = inject(BigBasketApi);

  private readonly productsResponse = toSignal(this.api.getProducts(), { initialValue: null });

  private readonly categoriesResponse = toSignal(this.api.getCategories(), { initialValue: null });

  readonly featuredProducts = computed(() => this.productsResponse()?.data.slice(0, 4) ?? []);

  readonly categories = computed(() => this.categoriesResponse()?.data ?? []);

  readonly loading = computed(
    () => this.productsResponse() === null || this.categoriesResponse() === null,
  );
}
