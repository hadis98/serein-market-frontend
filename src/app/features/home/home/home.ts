import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CategoryCard } from '../../categories/category-card/category-card';
import { ProductCard } from '../../products/product-card/product-card';
import { ProductStore } from '../../../core/state/product-store';
import { CategoryStore } from '../../../core/state/category-store';
import { ToastStore } from '../../../core/state/toast-store';

type BenefitIcon = 'delivery' | 'quality' | 'payment' | 'choices';

interface Benefit {
  readonly title: string;
  readonly description: string;
  readonly icon: BenefitIcon;
}

interface Promotion {
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly buttonLabel: string;
  readonly categoryMatch: string;
  readonly tone: 'green' | 'brown';
}

interface PromotionCard extends Promotion {
  readonly queryParams: { readonly category?: number };
}

@Component({
  imports: [RouterLink, CategoryCard, ProductCard],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly productStore = inject(ProductStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly toast = inject(ToastStore);

  readonly featuredProducts = computed(() => this.productStore.products().slice(0, 6));
  readonly bestSellerProducts = computed(() => this.productStore.products().slice(6, 12));
  readonly featuredCategories = computed(() => this.categories().slice(0, 6));

  readonly categories = this.categoryStore.categories;
  readonly productsLoading = this.productStore.loading;
  readonly categoriesLoading = this.categoryStore.loading;
  readonly productError = this.productStore.error;
  readonly categoryError = this.categoryStore.error;

  readonly categorySkeletons = Array.from({ length: 6 });
  readonly productSkeletons = Array.from({ length: 6 });

  readonly benefits: readonly Benefit[] = [
    { title: 'Free delivery', description: 'On orders over $40', icon: 'delivery' },
    { title: 'Fresh & high quality', description: 'Carefully sourced', icon: 'quality' },
    { title: 'Secure payment', description: 'Safe and encrypted', icon: 'payment' },
    { title: 'Better choices', description: 'For you and the planet', icon: 'choices' },
  ];

  readonly promotions: readonly Promotion[] = [
    {
      title: 'Fresh produce\nfor a healthier you',
      description: 'Seasonal fruits and vegetables, always fresh and full of goodness.',
      imageUrl: '/serein-fresh-produce-banner.png',
      buttonLabel: 'Shop fresh produce',
      categoryMatch: 'vegetable',
      tone: 'green',
    },
    {
      title: 'Pantry essentials\nfor everyday living',
      description: 'Stock up on your favourites.',
      imageUrl: '/serein-pantry-essentials-banner.png',
      buttonLabel: 'Shop pantry',
      categoryMatch: 'pantry',
      tone: 'brown',
    },
  ];

  readonly promotionCards = computed<readonly PromotionCard[]>(() =>
    this.promotions.map((promotion) => {
      const category = this.categories().find((item) =>
        `${item.categoryName} ${item.categorySlug}`.toLowerCase().includes(promotion.categoryMatch),
      );

      return {
        ...promotion,
        queryParams: category ? { category: category.categoryId } : {},
      };
    }),
  );

  subscribeToNewsletter(event: SubmitEvent): void {
    event.preventDefault();
    this.toast.show('Newsletter signup is coming soon.');
  }

  constructor() {
    void this.productStore.load();
    void this.categoryStore.load();
  }
}
