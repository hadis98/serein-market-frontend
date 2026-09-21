import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../core/models/category.model';

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

  readonly imageUrl = computed(() => this.category().categoryImageUrl);

  readonly fallbackLetter = computed(() => this.displayName().charAt(0).toUpperCase());
}
