import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../core/models/category';

@Component({
  imports: [RouterLink],
  selector: 'app-category-card',
  styleUrl: './category-card.css',
  templateUrl: './category-card.html',
})
export class CategoryCard {
  readonly category = input.required<Category>();

  readonly displayName = computed(() => {
    return this.category().categoryName.replace('Beveragesy', 'Beverages').replace('Eggss', 'Eggs');
  });

  readonly imageUrl = computed(() => {
    const category =
      `${this.category().categoryName} ${this.category().categorySlug}`.toLowerCase();

    if (category.includes('fruit')) return '/categories/fresh-fruits.png';
    if (category.includes('veget')) return '/categories/fresh-vegtables.png';
    if (category.includes('dairy') || category.includes('egg')) {
      return '/categories/dairy_and_eggs.png';
    }
    if (category.includes('baker')) return '/categories/bakery.png';
    if (category.includes('beverage') || category.includes('drink')) {
      return '/categories/beverages.png';
    }
    if (category.includes('snack')) return '/categories/snacks.png';
    if (category.includes('personal') || category.includes('care')) {
      return '/categories/personal_care.png';
    }

    return '/categories/pantry.png';
  });
}
