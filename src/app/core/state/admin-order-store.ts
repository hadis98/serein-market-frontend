import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { AdminOrderApi } from '../api/admin-order-api';

import type { AdminOrderDetails, AdminOrderSummary } from '../models/admin-order';

import type { OrderStatus } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderStore {
  private readonly api = inject(AdminOrderApi);

  private readonly ordersState = signal<AdminOrderSummary[]>([]);

  private readonly loadingState = signal(false);

  private readonly loadedState = signal(false);

  private readonly errorState = signal<string | null>(null);

  readonly orders = this.ordersState.asReadonly();

  readonly loading = this.loadingState.asReadonly();

  readonly loaded = this.loadedState.asReadonly();

  readonly error = this.errorState.asReadonly();

  readonly count = computed(() => this.ordersState().length);

  readonly pendingCount = computed(
    () => this.ordersState().filter((order) => order.status === 'PENDING').length,
  );

  readonly completedCount = computed(
    () => this.ordersState().filter((order) => order.status === 'DELIVERED').length,
  );

  readonly cancelledCount = computed(
    () => this.ordersState().filter((order) => order.status === 'CANCELLED').length,
  );

  async load(force = false): Promise<void> {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const orders = await firstValueFrom(this.api.getAll());

      this.ordersState.set(orders);

      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(this.getErrorMessage(error, 'Orders could not be loaded.'));
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadById(id: number): Promise<AdminOrderDetails> {
    try {
      return await firstValueFrom(this.api.getById(id));
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Order could not be loaded.'));
    }
  }

  async updateStatus(id: number, status: OrderStatus): Promise<AdminOrderDetails> {
    try {
      await firstValueFrom(this.api.updateStatus(id, status));

      await this.load(true);
      return await this.loadById(id);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Order status could not be updated.'));
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const message = error.error?.message;

    return Array.isArray(message) ? message.join(', ') : (message ?? fallback);
  }
}
