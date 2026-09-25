import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { CategoryStore } from '../../../core/state/category-store';
import { RouterLink } from '@angular/router';
import { CategoryPageCard } from '../category-page-card/category-page-card';
import { ProductStore } from '../../../core/state/product-store';
import { CategorySortOption } from '../../../core/models/category.model';
import {
  CATEGORIES_HERO_IMAGE_URL,
  CATEGORIES_SEASONAL_BANNER_IMAGE_URL,
} from '../../../core/config/image-urls';
import { Icon } from '../../../shared/ui/icon/icon';

type CategorySortMenuOption = {
  readonly value: CategorySortOption;
  readonly label: string;
  readonly description: string;
};

@Component({
  imports: [RouterLink, CategoryPageCard, Icon],
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
  readonly heroImageUrl = CATEGORIES_HERO_IMAGE_URL;
  readonly seasonalBannerImageUrl = CATEGORIES_SEASONAL_BANNER_IMAGE_URL;
  readonly searchTerm = signal('');
  readonly sortBy = signal<CategorySortOption>('name-asc');
  readonly sortMenuOpen = signal(false);
  readonly sortOptions: readonly CategorySortMenuOption[] = [
    {
      value: 'name-asc',
      label: 'Name: A to Z',
      description: 'Alphabetical order',
    },
    {
      value: 'name-desc',
      label: 'Name: Z to A',
      description: 'Reverse alphabetical',
    },
    {
      value: 'products-high',
      label: 'Most products',
      description: 'Largest departments first',
    },
    {
      value: 'products-low',
      label: 'Fewest products',
      description: 'Smallest departments first',
    },
  ];
  readonly selectedSortLabel = computed(
    () =>
      this.sortOptions.find((option) => option.value === this.sortBy())?.label ?? 'Name: A to Z',
  );

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

  toggleSortMenu(): void {
    this.sortMenuOpen.update((open) => !open);
  }

  selectSort(value: CategorySortOption): void {
    this.sortBy.set(value);
    this.sortMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeSortMenuOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Element && !target.closest('[data-category-sort]')) {
      this.sortMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeSortMenuOnEscape(): void {
    this.sortMenuOpen.set(false);
  }
}
