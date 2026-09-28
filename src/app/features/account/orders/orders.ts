import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderStore } from '../../../core/state/order-store';
import { OrderStatusBadge } from '../../../shared/ui/order-status-badge/order-status-badge';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, OrderStatusBadge],
  selector: 'app-orders',
  styleUrl: './orders.css',
  templateUrl: './orders.html',
})
export class Orders {
  readonly orderStore = inject(OrderStore);

  constructor() {
    void this.orderStore.load();
  }
}
