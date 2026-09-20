import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { CategoryStore } from '../../../../core/state/category-store';
import { ProductStore } from '../../../../core/state/product-store';
import { ToastStore } from '../../../../core/state/toast-store';
import { Category } from '../../../../core/models/category';

interface CategoryFormModel {
  name: string;
}

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-admin-categories',
  styleUrl: './admin-categories.css',
  templateUrl: './admin-categories.html',
})
export class AdminCategories {
  readonly categoryStore = inject(CategoryStore);
  private readonly productStore = inject(ProductStore);
  private readonly toast = inject(ToastStore);

  readonly showCreateDialog = signal(false);
  readonly pendingDelete = signal<Category | null>(null);
  readonly deleting = signal(false);

  readonly model = signal<CategoryFormModel>({ name: '' });

  readonly productCounts = computed(() => {
    const counts = new Map<number, number>();

    for (const product of this.productStore.products()) {
      const current = counts.get(product.categoryId) ?? 0;
      counts.set(product.categoryId, current + 1);
    }

    return counts;
  });

  readonly categoryForm = form(
    this.model,
    (path) => {
      required(path.name, {
        message: 'Category name is required',
      });

      minLength(path.name, 2, {
        message: 'Category name must contain at least 2 characters',
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          try {
            await this.categoryStore.create({
              name: value.name.trim(),
            });
            this.toast.show('Category created successfully.');
            this.closeCreateDialog();
            return;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Category could not be created.';

            this.toast.show(message, 'error');
            return {
              kind: 'serverError',
              message,
            };
          }
        },
      },
    },
  );

  constructor() {
    void this.categoryStore.load();
    void this.productStore.load();
  }

  openCreateDialog() {
    this.model.set({
      name: '',
    });

    this.showCreateDialog.set(true);
  }

  closeCreateDialog() {
    this.showCreateDialog.set(false);
  }

  askToDelete(category: Category) {
    this.pendingDelete.set(category);
  }

  cancelDelete() {
    this.pendingDelete.set(null);
  }

  async confirmDelete() {
    const category = this.pendingDelete();

    if (!category) {
      return;
    }

    this.deleting.set(true);

    try {
      await this.categoryStore.delete(category.categoryId);

      this.pendingDelete.set(null);

      this.toast.show('Category deleted successfully.');
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'Category could not be deleted.',
        'error',
      );
    } finally {
      this.deleting.set(false);
    }
  }
}
