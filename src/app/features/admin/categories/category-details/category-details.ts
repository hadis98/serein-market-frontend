import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductStore } from '../../../../core/state/product-store';
import { CategoryStore } from '../../../../core/state/category-store';
import { Product } from '../../../../core/models/product.model';
import type { CategoryDetails as CategoryDetailsModel } from '../../../../core/models/category.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
@Component({
  imports: [RouterLink, DatePipe, CurrencyPipe],
  selector: 'app-category-details',
  styleUrl: './category-details.css',
  templateUrl: './category-details.html',
})
export class CategoryDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly categoryStore = inject(CategoryStore);
  private readonly productStore = inject(ProductStore);

  readonly category = signal<CategoryDetailsModel | null>(null);
  readonly products = signal<Product[]>([]);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('Invalid category.');
      this.loading.set(false);
      return;
    }

    try {
      const [category, products] = await Promise.all([
        this.categoryStore.loadById(id),
        this.productStore.loadByCategory(id),
      ]);

      this.category.set(category);
      this.products.set(products);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Category could not be loaded.');
    } finally {
      this.loading.set(false);
    }
  }
}
