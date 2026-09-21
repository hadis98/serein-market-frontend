import { computed, inject, Injectable, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { OrderApi } from '../api/order-api';
import { OrderSummary, OrderDetails, CreateOrderRequest } from '../models/order.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderStore {
  private readonly api = inject(OrderApi);
  private readonly ordersState = signal<OrderSummary[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);

  readonly orders = this.ordersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  async load(force = false): Promise<void> {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);

    try {
      const orders = await firstValueFrom(this.api.getMine());

      this.ordersState.set(orders);
      this.loadedState.set(true);
    } finally {
      this.loadingState.set(true);
    }
  }

  async loadById(id: number): Promise<OrderDetails> {
    try {
      return await firstValueFrom(this.api.getById(id));
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Order could not be loaded.'));
    }
  }

  async placeOrder(request: CreateOrderRequest): Promise<OrderDetails> {
    try {
      const order = await firstValueFrom(this.api.create(request));

      await this.load(true);

      return order;
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Order could not be placed.'));
    }
  }

  async cancelOrder(id: number): Promise<void> {
    try {
      await firstValueFrom(this.api.cancel(id));

      await this.load(true);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Order could not be cancelled.'));
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
