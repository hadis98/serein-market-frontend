import { Component, input } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-category-page-card',
  styleUrl: './category-page-card.css',
  templateUrl: './category-page-card.html',
})
export class CategoryPageCard {
  readonly category = input.required<Category>();
  readonly productCount = input.required<number>();
}
