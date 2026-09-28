import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminOrderStore } from '../../../../core/state/admin-order-store';
import { OrderStatusBadge } from '../../../../shared/ui/order-status-badge/order-status-badge';

@Component({
  imports: [RouterLink, DatePipe, CurrencyPipe, OrderStatusBadge],
  selector: 'app-admin-orders',
  styleUrl: './admin-orders.css',
  templateUrl: './admin-orders.html',
})
export class AdminOrders {
  readonly orderStore = inject(AdminOrderStore);

  readonly search = signal('');

  readonly filteredOrders = computed(() => {
    const query = this.search().trim().toLowerCase();

    const orders = this.orderStore.orders();

    if (!query) {
      return orders;
    }

    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query),
    );
  });

  constructor() {
    void this.orderStore.load();
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.search.set(input.value);
  }
}
