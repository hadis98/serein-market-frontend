import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { BigBasketApi } from '../../../core/api/big-basket-api';
import { CategoryCard } from '../../categories/category-card/category-card';
import { ProductCard } from '../../products/product-card/product-card';
import { ProductStore } from '../../../core/state/product-store';
import { CategoryStore } from '../../../core/state/category-store';

@Component({
  imports: [RouterLink, CategoryCard, ProductCard],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly productStore = inject(ProductStore);
  private readonly categoryStore = inject(CategoryStore);

  readonly featuredProducts = computed(() => this.productStore.products().slice(0, 4));

  readonly categories = this.categoryStore.categories;

  readonly loading = computed(() => this.productStore.loading() || this.categoryStore.loading());

  constructor() {
    void this.productStore.load();
    void this.categoryStore.load();
  }
}
