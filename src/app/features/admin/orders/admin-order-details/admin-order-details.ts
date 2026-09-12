import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminOrderStore } from '../../../../core/state/admin-order-store';
import { CustomerStore } from '../../../../core/state/customer-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BackendSaleItem } from '../../../../core/models/order';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe, DatePipe, RouterLink],
  selector: 'app-admin-order-details',
  styleUrl: './admin-order-details.css',
  templateUrl: './admin-order-details.html',
})
export class AdminOrderDetails {
  private readonly route = inject(ActivatedRoute);
  readonly orderStore = inject(AdminOrderStore);
  readonly customerStore = inject(CustomerStore);
  readonly saleId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('saleId')))),
    {
      initialValue: 0,
    },
  );

  readonly order = computed(() => this.orderStore.getById(this.saleId()));

  readonly customer = computed(() => {
    const order = this.order();
    if (!order) {
      return undefined;
    }

    return this.customerStore.customers().find((customer) => customer.custId === order.custId);
  });

  readonly items = signal<BackendSaleItem[]>([]);

  readonly itemsLoading = signal(false);

  readonly itemsError = signal<string | null>(null);

  constructor() {
    void this.orderStore.load();
    void this.customerStore.load();

    effect(() => {
      const saleId = this.saleId();

      if (!saleId) {
        return;
      }

      void this.loadItems(saleId);
    });
  }

  private async loadItems(saleId: number): Promise<void> {
    this.itemsLoading.set(true);
    this.itemsError.set(null);

    try {
      const items = await this.orderStore.getItems(saleId);

      this.items.set(items);
    } catch (error) {
      this.itemsError.set(error instanceof Error ? error.message : 'Could not load order items.');
    } finally {
      this.itemsLoading.set(false);
    }
  }
}
