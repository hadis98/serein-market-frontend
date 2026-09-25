import { ViewportScroller } from '@angular/common';
import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCard } from '../product-card/product-card';
import {
  ProductFilters,
  type CategoryFilterOption,
  type ProductFilterValue,
} from '../product-filters/product-filters';
import { SortOption } from '../../../core/models/product.model';
import { ProductStore } from '../../../core/state/product-store';
import { CategoryStore } from '../../../core/state/category-store';
import { Icon, type IconName } from '../../../shared/ui/icon/icon';

const PAGE_SIZE = 8;
type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';
type SortMenuOption = {
  readonly value: SortOption;
  readonly label: string;
  readonly description: string;
  readonly icon: IconName;
};

@Component({
  imports: [ProductCard, ProductFilters, Icon],
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

  readonly skeletonItems = Array.from({ length: PAGE_SIZE });
  readonly searchTerm = linkedSignal(() => this.queryParams().get('search') ?? '');
  readonly sortBy = signal<SortOption>('default');
  readonly sortMenuOpen = signal(false);
  readonly sortOptions: readonly SortMenuOption[] = [
    {
      value: 'default',
      label: 'Featured',
      description: 'Our recommended order',
      icon: 'star',
    },
    {
      value: 'price-low',
      label: 'Price: Low to high',
      description: 'Lowest price first',
      icon: 'sort-price-asc',
    },
    {
      value: 'price-high',
      label: 'Price: High to low',
      description: 'Highest price first',
      icon: 'sort-price-desc',
    },
    {
      value: 'name',
      label: 'Name: A to Z',
      description: 'Alphabetical order',
      icon: 'sort-alphabetical-asc',
    },
  ];

  readonly selectedSortLabel = computed(
    () => this.sortOptions.find((option) => option.value === this.sortBy())?.label ?? 'Featured',
  );
  readonly selectedSortIcon = computed<IconName>(
    () => this.sortOptions.find((option) => option.value === this.sortBy())?.icon ?? 'star',
  );

  readonly products = this.productStore.products;
  readonly loading = this.productStore.loading;
  readonly error = this.productStore.error;
  readonly categories = this.categoryStore.categories;

  readonly selectedCategoryIds = linkedSignal<readonly number[]>(() => {
    const multipleCategories = this.queryParams().get('categories');

    if (multipleCategories) {
      return [
        ...new Set(
          multipleCategories
            .split(',')
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0),
        ),
      ];
    }

    const categoryId = Number(this.queryParams().get('category'));
    return Number.isInteger(categoryId) && categoryId > 0 ? [categoryId] : [];
  });

  readonly priceLimit = computed(() => {
    const highestProductPrice = Math.max(
      0,
      ...this.products().map((product) => product.productPrice),
    );

    return Math.max(50, Math.ceil(highestProductPrice));
  });

  readonly selectedMaximumPrice = linkedSignal(() => this.priceLimit());
  readonly selectedMinimumPrice = signal(0);
  readonly inStockOnly = signal(false);

  readonly categoryFilterOptions = computed<readonly CategoryFilterOption[]>(() =>
    this.categories().map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName
        .replace('Beveragesy', 'Beverages')
        .replace('Eggss', 'Eggs'),
      productCount: this.products().filter((product) => product.categoryId === category.categoryId)
        .length,
    })),
  );

  readonly filterValue = computed<ProductFilterValue>(() => ({
    categoryIds: this.selectedCategoryIds(),
    minimumPrice: this.selectedMinimumPrice(),
    maximumPrice: this.selectedMaximumPrice(),
    inStockOnly: this.inStockOnly(),
  }));

  readonly currentPage = computed(() => {
    const page = Number(this.queryParams().get('page'));
    return Number.isInteger(page) && page > 0 ? page : 1;
  });

  readonly visibleProducts = computed(() => {
    let products = this.products();
    const categoryIds = this.selectedCategoryIds();
    const search = this.searchTerm().trim().toLowerCase();

    if (categoryIds.length > 0) {
      products = products.filter((product) => categoryIds.includes(product.categoryId));
    }

    if (search) {
      products = products.filter((product) =>
        product.productName.toLocaleLowerCase().includes(search),
      );
    }

    products = products.filter(
      (product) =>
        product.productPrice >= this.selectedMinimumPrice() &&
        product.productPrice <= this.selectedMaximumPrice(),
    );

    if (this.inStockOnly()) {
      products = products.filter((product) => product.stockQuantity > 0);
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

  readonly totalProducts = computed(() => this.visibleProducts().length);
  readonly totalPages = computed(() => Math.ceil(this.totalProducts() / PAGE_SIZE));

  readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.visibleProducts().slice(start, start + PAGE_SIZE);
  });

  readonly paginationItems = computed<readonly PaginationItem[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: PaginationItem[] = [1];
    const firstMiddlePage = Math.max(2, currentPage - 1);
    const lastMiddlePage = Math.min(totalPages - 1, currentPage + 1);

    if (firstMiddlePage > 2) {
      items.push('ellipsis-start');
    }

    for (let page = firstMiddlePage; page <= lastMiddlePage; page += 1) {
      items.push(page);
    }

    if (lastMiddlePage < totalPages - 1) {
      items.push('ellipsis-end');
    }

    items.push(totalPages);
    return items;
  });

  readonly showingFrom = computed(() =>
    this.totalProducts() === 0 ? 0 : (this.currentPage() - 1) * PAGE_SIZE + 1,
  );

  readonly showingTo = computed(() =>
    Math.min(this.currentPage() * PAGE_SIZE, this.totalProducts()),
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

  updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.resetPage();
  }

  toggleSortMenu(): void {
    this.sortMenuOpen.update((open) => !open);
  }

  selectSort(value: SortOption): void {
    this.sortBy.set(value);
    this.sortMenuOpen.set(false);
    this.resetPage();
  }

  @HostListener('document:click', ['$event'])
  closeSortMenuOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Element && !target.closest('[data-product-sort]')) {
      this.sortMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeSortMenuOnEscape(): void {
    this.sortMenuOpen.set(false);
  }

  updateFilters(value: ProductFilterValue): void {
    const categoryChanged = !this.haveSameCategoryIds(
      this.selectedCategoryIds(),
      value.categoryIds,
    );

    this.selectedCategoryIds.set(value.categoryIds);
    const maximumPrice = Math.min(Math.max(0, value.maximumPrice), this.priceLimit());
    this.selectedMinimumPrice.set(Math.min(Math.max(0, value.minimumPrice), maximumPrice));
    this.selectedMaximumPrice.set(maximumPrice);
    this.inStockOnly.set(value.inStockOnly);

    if (categoryChanged) {
      void this.updateCategoryQuery(value.categoryIds);
    } else {
      this.resetPage();
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }

    await this.updatePageQuery(page);
    this.viewportScroller.scrollToAnchor('product-grid');
  }

  private resetPage(): void {
    if (this.currentPage() !== 1) {
      void this.updatePageQuery(1, true);
    }
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

  private haveSameCategoryIds(currentIds: readonly number[], nextIds: readonly number[]): boolean {
    return currentIds.length === nextIds.length && currentIds.every((id) => nextIds.includes(id));
  }
}
