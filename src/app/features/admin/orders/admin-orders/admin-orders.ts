import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { AdminOrderStore } from '../../../../core/state/admin-order-store';
import { CustomerStore } from '../../../../core/state/customer-store';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe, DecimalPipe],
  selector: 'app-admin-orders',
  styleUrl: './admin-orders.css',
  templateUrl: './admin-orders.html'
})
export class AdminOrders {
  readonly orderStore = inject(AdminOrderStore);
  readonly customerStore = inject(CustomerStore);
  readonly search = signal('');

  readonly customerNames = computed(() => {
    const names = new Map<number, string>();

    for (const customer of this.customerStore.customers()) {
      names.set(customer.custId, customer.name);
    }

    return names;
  });

  constructor() {
    void this.orderStore.load();
    void this.customerStore.load();
  }

  readonly filteredOrders = computed(() => {
    const query = this.search().trim().toLowerCase();
    const orders = this.orderStore.orders();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const customerName = this.customerNames().get(order.custId) ?? '';

      return (
        String(order.saleId).includes(query) ||
        String(order.custId).includes(query) ||
        customerName.toLowerCase().includes(query) ||
        order.deliveryCity.toLowerCase().includes(query) ||
        order.paymentNaration.toLowerCase().includes(query)
      );
    });
  });

  customerName(customerId: number): string {
    return this.customerNames().get(customerId) ?? `Customer #${customerId}`;
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }
}
