import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCard } from '../product-card/product-card';
import { SortOption } from '../../../core/models/product';
import { ProductStore } from '../../../core/state/product-store';

@Component({
  imports: [ProductCard],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {
  private readonly productStore = inject(ProductStore);
  private readonly route = inject(ActivatedRoute);

  readonly skeletonItems = Array.from({ length: 8 });
  readonly searchTerm = signal('');
  readonly sortBy = signal<SortOption>('default');

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly products = this.productStore.products;
  readonly loading = this.productStore.loading;

  constructor() {
    void this.productStore.load();
  }
  
  readonly selectedCategoryId = computed(() => {
    const category = this.queryParams().get('category');
    return category ? Number(category) : null;
  });

  updateSort(event: Event) {
    const select = event.target as HTMLSelectElement;

    this.sortBy.set(select.value as SortOption);
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  readonly visibleProducts = computed(() => {
    let products = this.products();

    const categoryId = this.selectedCategoryId();
    const search = this.searchTerm().trim().toLowerCase();

    if (categoryId) {
      products = products.filter((product) => product.categoryId === categoryId);
    }

    if (search) {
      products = products.filter((product) =>
        product.productName.toLocaleLowerCase().includes(search),
      );
    }

    switch (this.sortBy()) {
      case 'price-low':
        return [...products].sort((a, b) => a.productPrice - b.productPrice);

      case 'price-high':
        return [...products].sort((a, b) => b.productPrice - a.productPrice);

      case 'name':
        return [...products].sort((a, b) => a.productName.localeCompare(b.productName));

      default:
        return products;
    }
  });
}
