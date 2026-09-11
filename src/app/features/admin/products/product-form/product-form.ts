import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, form, FormRoot, min, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from '../../../../core/state/product-store';
import { ToastStore } from '../../../../core/state/toast-store';
import { BigBasketApi } from '../../../../core/api/big-basket-api';
import { ProductUpsertRequest } from '../../../../core/models/product-request';

interface ProductFormModel {
  sku: string;
  name: string;
  price: number | null;
  shortName: string;
  description: string;
  deliveryTimeSpan: string;
  categoryId: string;
  imageUrl: string;
}

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm {
  readonly productStore = inject(ProductStore);
  private readonly api = inject(BigBasketApi);
  private readonly toast = inject(ToastStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly initialized = signal(false);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  private readonly categoriesResponse = toSignal(this.api.getCategories(), {
    initialValue: null,
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

  readonly categories = computed(() => this.categoriesResponse()?.data ?? []);

  readonly model = signal<ProductFormModel>({
    sku: '',
    name: '',
    price: null,
    shortName: '',
    description: '',
    deliveryTimeSpan: '',
    categoryId: '',
    imageUrl: '',
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

      min(path.price, 1, {
        message: 'Price is required',
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
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          const id = this.productId();
          const existingProduct = this.product();

          const request: ProductUpsertRequest = {
            ProductId: id ?? 0,
            ProductSku: value.sku,
            ProductName: value.name,
            ProductPrice: value.price ?? 0,
            ProductShortName: value.shortName,
            ProductDescription: value.description,
            CreatedDate: existingProduct?.createdDate ?? new Date().toISOString(),
            DeliveryTimeSpan: value.deliveryTimeSpan,
            CategoryId: Number(value.categoryId),
            ProductImageUrl: value.imageUrl,
            UserId: 0,
          };

          try {
            if (this.isEditMode()) {
              await this.productStore.update(request);
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

        shortName: product.productShortName,

        description: product.productDescription,

        deliveryTimeSpan: product.deliveryTimeSpan,

        categoryId: String(product.categoryId),

        imageUrl: product.productImageUrl,
      });

      this.initialized.set(true);
    });
  }
}
