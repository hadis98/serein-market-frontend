import { Component, computed, inject } from '@angular/core';

import { AdminOrderStore } from '../../../core/state/admin-order-store';
import { AdminCustomerStore } from '../../../core/state/admin-customer-store';
import { ProductStore } from '../../../core/state/product-store';
import { CategoryStore } from '../../../core/state/category-store';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  imports: [RouterLink, DatePipe, CurrencyPipe, Icon],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly productStore = inject(ProductStore);
  readonly categoryStore = inject(CategoryStore);
  readonly orderStore = inject(AdminOrderStore);
  readonly customerStore = inject(AdminCustomerStore);

  readonly lowStockProducts = computed(() => {
    return this.productStore
      .products()
      .filter(
        (product) =>
          product.status === 'ACTIVE' && product.stockQuantity > 0 && product.stockQuantity <= 5,
      )
      .sort((a, b) => a.stockQuantity - b.stockQuantity);
  });

  readonly outOfStockProducts = computed(() => {
    return this.productStore
      .products()
      .filter((product) => product.status === 'ACTIVE' && product.stockQuantity === 0);
  });

  readonly recentOrders = computed(() => {
    return [...this.orderStore.orders()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  readonly recentCustomers = computed(() => {
    return [...this.customerStore.customers()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  readonly orderStatusCounts = computed(() => {
    const orders = this.orderStore.orders();

    return [
      {
        label: 'Pending',
        value: orders.filter((order) => order.status === 'PENDING').length,
      },
      {
        label: 'Confirmed',
        value: orders.filter((order) => order.status === 'CONFIRMED').length,
      },
      {
        label: 'Shipped',
        value: orders.filter((order) => order.status === 'SHIPPED').length,
      },
      {
        label: 'Delivered',
        value: orders.filter((order) => order.status === 'DELIVERED').length,
      },
      {
        label: 'Cancelled',
        value: orders.filter((order) => order.status === 'CANCELLED').length,
      },
    ];
  });

  readonly maxOrderStatusCount = computed(() => {
    const counts = this.orderStatusCounts().map((status) => status.value);

    return Math.max(...counts, 1);
  });

  constructor() {
    void this.productStore.load();
    void this.categoryStore.load();

    void this.orderStore.load();
    void this.customerStore.load();
  }
}
