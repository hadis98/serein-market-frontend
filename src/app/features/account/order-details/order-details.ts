import { Component, inject, signal } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { OrderStore } from '../../../core/state/order-store';

import { AuthStore } from '../../../core/auth/auth-store';

import { ToastStore } from '../../../core/state/toast-store';

import type { OrderDetails as OrderDetailsModel } from '../../../core/models/order';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],

  selector: 'app-order-details',

  styleUrl: './order-details.css',

  templateUrl: './order-details.html',
})
export class OrderDetails {
  private readonly route = inject(ActivatedRoute);

  private readonly store = inject(OrderStore);

  private readonly toast = inject(ToastStore);

  readonly auth = inject(AuthStore);

  readonly order = signal<OrderDetailsModel | null>(null);

  readonly loading = signal(true);

  constructor() {
    void this.load();
  }

  async cancelOrder(): Promise<void> {
    const order = this.order();

    if (!order) {
      return;
    }

    try {
      await this.store.cancelOrder(order.id);

      await this.load();

      this.toast.show('Order cancelled.');
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : 'Could not cancel order.', 'error');
    }
  }

  private async load(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading.set(false);
      return;
    }

    try {
      this.order.set(await this.store.loadById(id));
    } catch {
      this.order.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
