import { Component, HostListener, input, output, signal } from '@angular/core';
import { Icon, type IconName } from '../../../shared/ui/icon/icon';
import { SortOption } from '../../../core/models/product.model';
interface SortMenuOption {
  readonly value: SortOption;
  readonly label: string;
  readonly description: string;
  readonly icon: IconName;
}

const SORT_OPTIONS: readonly SortMenuOption[] = [
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

@Component({
  imports: [Icon],
  selector: 'app-product-sort',
  styleUrl: './product-sort.css',
  templateUrl: './product-sort.html',
})
export class ProductSort {
  readonly value = input.required<SortOption>();

  readonly valueChange = output<SortOption>();

  readonly menuOpen = signal(false);

  readonly options = SORT_OPTIONS;

  get selectedOption(): SortMenuOption {
    return SORT_OPTIONS.find((option) => option.value === this.value()) ?? SORT_OPTIONS[0];
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  select(option: SortOption): void {
    this.valueChange.emit(option);

    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Element && !target.closest('[data-product-sort]')) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.menuOpen.set(false);
  }
}
