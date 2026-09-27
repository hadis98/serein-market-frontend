import { Component, computed, input, output } from '@angular/core';
import { Icon } from '../../../shared/ui/icon/icon';
type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

@Component({
  imports: [Icon],
  selector: 'app-product-pagination',
  styleUrl: './product-pagination.css',
  templateUrl: './product-pagination.html',
})
export class ProductPagination {
  readonly currentPage = input.required<number>();

  readonly totalPages = input.required<number>();

  readonly totalItems = input.required<number>();

  readonly pageSize = input.required<number>();

  readonly pageChange = output<number>();

  readonly showingFrom = computed(() => {
    if (this.totalItems() === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  readonly showingTo = computed(() =>
    Math.min(
      this.currentPage() * this.pageSize(),

      this.totalItems(),
    ),
  );

  readonly paginationItems = computed<readonly PaginationItem[]>(() => {
    const totalPages = this.totalPages();

    const currentPage = this.currentPage();

    if (totalPages <= 5) {
      return Array.from(
        {
          length: totalPages,
        },

        (_, index) => index + 1,
      );
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

  goToPage(page: number): void {
    const pageIsInvalid = page < 1 || page > this.totalPages();

    const alreadyOnPage = page === this.currentPage();

    if (pageIsInvalid || alreadyOnPage) {
      return;
    }

    this.pageChange.emit(page);
  }
}
