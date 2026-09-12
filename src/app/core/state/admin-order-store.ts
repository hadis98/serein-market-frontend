import { computed, inject, Injectable, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { OrderApi } from '../api/order-api';
import { BackendSale, BackendSaleItem } from '../models/order';
@Injectable({
  providedIn: 'root',
})
export class AdminOrderStore {
  private readonly orderApi = inject(OrderApi);

  private readonly ordersState = signal<BackendSale[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly orders = this.ordersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly count = computed(() => this.ordersState().length);
  readonly activeCount = computed(
    () => this.ordersState().filter((order) => !order.isCanceled).length,
  );

  readonly cancelledCount = computed(
    () => this.ordersState().filter((order) => order.isCanceled).length,
  );

  readonly totalRevenue = computed(() =>
    this.ordersState()
      .filter((order) => !order.isCanceled)
      .reduce((total, order) => total + order.totalInvoiceAmount, 0),
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
      const response = await firstValueFrom(this.orderApi.getAllSales());

      if (!response.result) {
        throw new Error(response.message || 'Could not load orders.');
      }

      this.ordersState.set(response.data ?? []);
      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Could not load orders.');
    } finally {
      this.loadingState.set(false);
    }
  }

  getById(saleId: number): BackendSale | undefined {
    return this.ordersState().find((order) => order.saleId === saleId);
  }

  async getItems(saleId: number): Promise<BackendSaleItem[]> {
    const response = await firstValueFrom(this.orderApi.getSaleItems(saleId));
    if(!response.result){
        throw new Error(response.message || 'Could not load order items.');
    }

    return response.data ?? [];
  }
}
