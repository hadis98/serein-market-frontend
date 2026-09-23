import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Icon } from '../../../shared/ui/icon/icon';

export interface CategoryFilterOption {
  readonly categoryId: number;
  readonly categoryName: string;
  readonly productCount: number;
}

export interface ProductFilterValue {
  readonly categoryIds: readonly number[];
  readonly minimumPrice: number;
  readonly maximumPrice: number;
  readonly inStockOnly: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  selector: 'app-product-filters',
  styleUrl: './product-filters.css',
  templateUrl: './product-filters.html',
})
export class ProductFilters {
  readonly categories = input.required<readonly CategoryFilterOption[]>();
  readonly priceLimit = input.required<number>();
  readonly value = input.required<ProductFilterValue>();

  readonly valueChange = output<ProductFilterValue>();

  readonly hasActiveFilters = computed(() => {
    const value = this.value();

    return (
      value.categoryIds.length > 0 ||
      value.minimumPrice > 0 ||
      value.maximumPrice < this.priceLimit() ||
      value.inStockOnly
    );
  });

  readonly maximumPriceLabel = computed(() => {
    const selectedPrice = this.value().maximumPrice;
    return `$${selectedPrice}${selectedPrice === this.priceLimit() ? '+' : ''}`;
  });

  readonly minimumPricePosition = computed(() =>
    this.priceLimit() === 0 ? 0 : (this.value().minimumPrice / this.priceLimit()) * 100,
  );

  readonly maximumPricePosition = computed(() =>
    this.priceLimit() === 0 ? 100 : (this.value().maximumPrice / this.priceLimit()) * 100,
  );

  isCategorySelected(categoryId: number): boolean {
    return this.value().categoryIds.includes(categoryId);
  }

  toggleCategory(categoryId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const categoryIds = checked
      ? [...new Set([...this.value().categoryIds, categoryId])]
      : this.value().categoryIds.filter((id) => id !== categoryId);

    this.emitValue({ categoryIds });
  }

  updateMinimumPrice(event: Event): void {
    const minimumPrice = Math.min(
      Number((event.target as HTMLInputElement).value),
      this.value().maximumPrice,
    );

    this.emitValue({ minimumPrice });
  }

  updateMaximumPrice(event: Event): void {
    const maximumPrice = Math.max(
      Number((event.target as HTMLInputElement).value),
      this.value().minimumPrice,
    );

    this.emitValue({ maximumPrice });
  }

  updateAvailability(event: Event): void {
    this.emitValue({
      inStockOnly: (event.target as HTMLInputElement).checked,
    });
  }

  clearAll(): void {
    this.valueChange.emit({
      categoryIds: [],
      minimumPrice: 0,
      maximumPrice: this.priceLimit(),
      inStockOnly: false,
    });
  }

  private emitValue(changes: Partial<ProductFilterValue>): void {
    this.valueChange.emit({
      ...this.value(),
      ...changes,
    });
  }
}
