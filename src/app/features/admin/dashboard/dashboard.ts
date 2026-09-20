import { Component, inject } from '@angular/core';

import { AdminOrderStore } from '../../../core/state/admin-order-store';
import { AdminCustomerStore } from '../../../core/state/admin-customer-store';
import { ProductStore } from '../../../core/state/product-store';
import { CategoryStore } from '../../../core/state/category-store';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly productStore = inject(ProductStore);
  private readonly categoryStore = inject(CategoryStore);
  readonly orderStore = inject(AdminOrderStore);
  readonly customerStore = inject(AdminCustomerStore);

  readonly productCount = this.productStore.count;
  readonly categoryCount = this.categoryStore.count;

  constructor() {
    void this.productStore.load();
    void this.categoryStore.load();

    void this.orderStore.load();
    void this.customerStore.load();
  }
}
