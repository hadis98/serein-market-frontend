import { ViewportScroller } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import type { SortOption } from '../../../core/models/product.model';
import { CategoryStore } from '../../../core/state/category-store';
import { ProductStore } from '../../../core/state/product-store';
import { ProductCard } from '../product-card/product-card';
import {
  ProductFilters,
  type CategoryFilterOption,
  type ProductFilterValue,
} from '../product-filters/product-filters';

import {
  calculatePriceLimit,
  clamp,
  filterProducts,
  haveSameCategoryIds,
  paginate,
  parseCategoryIds,
  parsePage,
  sortProducts,
  type ProductFilterCriteria,
} from './products.logic';
import { ProductSort } from '../product-sort/product-sort';
import { ProductPagination } from '../product-pagination/product-pagination';

const PAGE_SIZE = 8;
@Component({
  imports: [ProductCard, ProductFilters, ProductSort, ProductPagination],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {
  private readonly productStore = inject(ProductStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly products = this.productStore.products;
  readonly loading = this.productStore.loading;
  readonly error = this.productStore.error;
  readonly categories = this.categoryStore.categories;

  readonly skeletonItems = Array.from({
    length: PAGE_SIZE,
  });

  readonly pageSize = PAGE_SIZE;

  readonly searchTerm = linkedSignal(() => this.queryParams().get('search') ?? '');

  readonly selectedCategoryIds = linkedSignal<readonly number[]>(() =>
    parseCategoryIds(
      this.queryParams().get('categories'),
      this.queryParams().get('category'),
    ),
  );

  readonly selectedMinimumPrice = signal(0);
  readonly priceLimit = computed(() => calculatePriceLimit(this.products()));
  readonly selectedMaximumPrice = linkedSignal(() => this.priceLimit());
  readonly inStockOnly = signal(false);
  readonly sortBy = signal<SortOption>('default');
  readonly currentPage = computed(() => parsePage(this.queryParams().get('page')));

  readonly categoryFilterOptions = computed<readonly CategoryFilterOption[]>(() =>
    this.categories().map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      productCount: category.productCount,
    })),
  );

  readonly filterValue = computed<ProductFilterValue>(() => ({
    categoryIds: this.selectedCategoryIds(),
    minimumPrice: this.selectedMinimumPrice(),
    maximumPrice: this.selectedMaximumPrice(),
    inStockOnly: this.inStockOnly(),
  }));

  private readonly filterCriteria = computed<ProductFilterCriteria>(() => ({
    categoryIds: this.selectedCategoryIds(),
    searchTerm: this.searchTerm(),
    minimumPrice: this.selectedMinimumPrice(),
    maximumPrice: this.selectedMaximumPrice(),
    inStockOnly: this.inStockOnly(),
  }));

  private readonly filteredProducts = computed(() =>
    filterProducts(this.products(), this.filterCriteria()),
  );

  private readonly sortedProducts = computed(() =>
    sortProducts(this.filteredProducts(), this.sortBy()),
  );

  readonly totalProducts = computed(() => this.filteredProducts().length);
  readonly totalPages = computed(() => Math.ceil(this.totalProducts() / PAGE_SIZE));

  readonly paginatedProducts = computed(() =>
    paginate(this.sortedProducts(), this.currentPage(), PAGE_SIZE),
  );

  constructor() {
    void this.productStore.load();
    void this.categoryStore.load();

    effect(() => {
      if (this.loading()) {
        return;
      }

      const lastPage = Math.max(1, this.totalPages());

      if (this.currentPage() > lastPage) {
        void this.updatePageQuery(lastPage, true);
      }
    });
  }

  updateSearch(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.resetPage();
  }

  updateSort(value: SortOption): void {
    this.sortBy.set(value);
    this.resetPage();
  }

  updateFilters(value: ProductFilterValue): void {
    const categoryChanged = !haveSameCategoryIds(this.selectedCategoryIds(), value.categoryIds);

    const maximumPrice = clamp(value.maximumPrice, 0, this.priceLimit());
    const minimumPrice = clamp(value.minimumPrice, 0, maximumPrice);

    this.selectedCategoryIds.set(value.categoryIds);
    this.selectedMinimumPrice.set(minimumPrice);
    this.selectedMaximumPrice.set(maximumPrice);
    this.inStockOnly.set(value.inStockOnly);

    if (categoryChanged) {
      void this.updateCategoryQuery(value.categoryIds);
      return;
    }
    this.resetPage();
  }

  async goToPage(page: number): Promise<void> {
    const pageIsInvalid = page < 1 || page > this.totalPages();
    const alreadyOnPage = page === this.currentPage();
    if (pageIsInvalid || alreadyOnPage) {
      return;
    }

    await this.updatePageQuery(page);
    this.viewportScroller.scrollToAnchor('product-grid');
  }

  private resetPage(): void {
    if (this.currentPage() === 1) {
      return;
    }
    void this.updatePageQuery(1, true);
  }

  private updatePageQuery(page: number, replaceUrl = false): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page === 1 ? null : page,
      },
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  private updateCategoryQuery(categoryIds: readonly number[]): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: categoryIds.length === 1 ? categoryIds[0] : null,
        categories: categoryIds.length > 1 ? categoryIds.join(',') : null,
        page: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
