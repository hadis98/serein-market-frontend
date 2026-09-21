import { Component, inject, signal } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { AdminOrderStore } from '../../../../core/state/admin-order-store';

import { ToastStore } from '../../../../core/state/toast-store';

import type { AdminOrderDetails as AdminOrderDetailsModel } from '../../../../core/models/admin-order.model';

import type { OrderStatus } from '../../../../core/models/order.model';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],

  selector: 'app-admin-order-details',

  styleUrl: './admin-order-details.css',

  templateUrl: './admin-order-details.html',
})
export class AdminOrderDetails {
  private readonly route = inject(ActivatedRoute);

  private readonly orderStore = inject(AdminOrderStore);

  private readonly toast = inject(ToastStore);

  readonly order = signal<AdminOrderDetailsModel | null>(null);

  readonly loading = signal(true);

  readonly updating = signal(false);

  readonly error = signal<string | null>(null);

  constructor() {
    void this.load();
  }

  allowedStatuses(status: OrderStatus): OrderStatus[] {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],

      CONFIRMED: ['SHIPPED'],

      SHIPPED: ['DELIVERED'],

      DELIVERED: [],

      CANCELLED: [],
    };

    return transitions[status];
  }

  async updateStatus(status: OrderStatus): Promise<void> {
    const order = this.order();

    if (!order) {
      return;
    }

    this.updating.set(true);

    try {
      const updated = await this.orderStore.updateStatus(order.id, status);

      this.order.set(updated);

      this.toast.show(`Order marked as ${status.toLowerCase()}.`);
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : 'Could not update order.', 'error');
    } finally {
      this.updating.set(false);
    }
  }

  private async load(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Invalid order.');

      this.loading.set(false);

      return;
    }

    try {
      const order = await this.orderStore.loadById(id);

      this.order.set(order);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Order could not be loaded.');
    } finally {
      this.loading.set(false);
    }
  }
}
