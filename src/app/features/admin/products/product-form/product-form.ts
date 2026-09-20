import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, form, FormRoot, min, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from '../../../../core/state/product-store';
import { ToastStore } from '../../../../core/state/toast-store';

import { ProductUpsertRequest } from '../../../../core/models/product-request';
import { CategoryStore } from '../../../../core/state/category-store';

interface ProductFormModel {
  sku: string;
  name: string;
  price: number | null;
  shortDescription: string;
  description: string;
  deliveryTimeSpan: string;
  categoryId: string;
  imageUrl: string;
  stockQuantity: number | null;
}

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm {
  readonly productStore = inject(ProductStore);
  readonly categoryStore = inject(CategoryStore);
  private readonly toast = inject(ToastStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly initialized = signal(false);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly productId = computed(() => {
    const id = this.params().get('id');

    return id ? Number(id) : null;
  });

  readonly isEditMode = computed(() => this.productId() !== null);

  readonly product = computed(() => {
    const id = this.productId();

    if (id === null) {
      return undefined;
    }

    return this.productStore.getById(id);
  });

  readonly model = signal<ProductFormModel>({
    sku: '',
    name: '',
    price: null,
    shortDescription: '',
    description: '',
    deliveryTimeSpan: '',
    categoryId: '',
    imageUrl: '',
    stockQuantity: 0,
  });

  readonly productForm = form(
    this.model,
    (path) => {
      required(path.sku, {
        message: 'SKU is required',
      });

      required(path.name, {
        message: 'Product name is required',
      });

      minLength(path.name, 2, {
        message: 'Product name must contain at least 2 characters',
      });

      required(path.price, {
        message: 'Price is required',
      });

      min(path.price, 0.01, {
        message: 'Price must be greater than 0',
      });

      required(path.description, {
        message: 'Description is required',
      });

      required(path.deliveryTimeSpan, {
        message: 'Delivery time is required',
      });

      required(path.categoryId, {
        message: 'Category is required',
      });

      required(path.imageUrl, {
        message: 'Image URL is required',
      });

      required(path.stockQuantity, {
        message: 'Stock quantity is required.',
      });

      min(path.stockQuantity, 0, {
        message: 'Stock cannot be negative',
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          const id = this.productId();
          const existingProduct = this.product();

          const request: ProductUpsertRequest = {
            sku: value.sku,
            name: value.name,
            price: value.price ?? 0,
            shortDescription: value.shortDescription || undefined,
            description: value.description,
            deliveryEstimate: value.deliveryTimeSpan || undefined,
            categoryId: Number(value.categoryId),
            imageUrl: value.imageUrl,
            stockQuantity: value.stockQuantity ?? 0,
          };

          try {
            if (this.isEditMode()) {
              await this.productStore.update(id!, request);
              this.toast.show('Product updated successfully.');
            } else {
              await this.productStore.create(request);
              this.toast.show('Product created successfully.');
            }

            await this.router.navigate(['/admin/products']);
            return;
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Product could not be saved.';

            this.toast.show(message, 'error');

            return {
              kind: 'server',
              message,
            };
          }
        },
      },
    },
  );

  constructor() {
    void this.productStore.load();
    void this.categoryStore.load();

    effect(() => {
      if (!this.isEditMode()) {
        this.initialized.set(true);
        return;
      }

      if (this.initialized()) {
        return;
      }

      const product = this.product();
      if (!product) {
        return;
      }

      this.model.set({
        sku: product.productSku,

        name: product.productName,

        price: product.productPrice,

        shortDescription: product.productDescription,

        description: product.productDescription,

        deliveryTimeSpan: product.deliveryTimeSpan,

        categoryId: String(product.categoryId),

        imageUrl: product.productImageUrl,

        stockQuantity: product.stockQuantity,
      });

      this.initialized.set(true);
    });
  }
}
