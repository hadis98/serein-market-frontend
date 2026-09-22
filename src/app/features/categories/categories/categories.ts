import { Component, computed, inject, signal } from '@angular/core';
import { CategoryStore } from '../../../core/state/category-store';
import { RouterLink } from '@angular/router';
import { CategoryPageCard } from '../category-page-card/category-page-card';
import { ProductStore } from '../../../core/state/product-store';
import { CategorySortOption } from '../../../core/models/category.model';

@Component({
  imports: [RouterLink, CategoryPageCard],
  selector: 'app-categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
})
export class Categories {
  private readonly categoryStore = inject(CategoryStore);
  private readonly productStore = inject(ProductStore);

  readonly categories = this.categoryStore.categories;
  readonly categoriesLoading = this.categoryStore.loading;
  readonly categoryError = this.categoryStore.error;

  readonly products = this.productStore.products;
  readonly productsLoading = this.productStore.loading;
  readonly productError = this.productStore.error;

  readonly categorySkeletons = Array.from({ length: 8 });
  readonly searchTerm = signal('');
  readonly sortBy = signal<CategorySortOption>('name-asc');

  constructor() {
    void this.categoryStore.load();
    void this.productStore.load();
  }

  readonly categoryProductCounts = computed(() => {
    const counts = new Map<number, number>();
    for (const product of this.products()) {
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    }

    return counts;
  });

  readonly visibleCategories = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    let categories = this.categories();
    if (search) {
      categories = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(search),
      );
    }

    switch (this.sortBy()) {
      case 'name-desc':
        return [...categories].sort((a, b) => b.categoryName.localeCompare(a.categoryName));

      case 'products-high':
        return [...categories].sort(
          (a, b) =>
            (this.categoryProductCounts().get(b.categoryId) ?? 0) -
            (this.categoryProductCounts().get(a.categoryId) ?? 0),
        );

      case 'products-low':
        return [...categories].sort(
          (a, b) =>
            (this.categoryProductCounts().get(a.categoryId) ?? 0) -
            (this.categoryProductCounts().get(b.categoryId) ?? 0),
        );
      default:
        return [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName));
    }
  });

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  updateSort(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value as CategorySortOption);
  }
}
