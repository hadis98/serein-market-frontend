import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderStore } from '../../../core/state/order-store';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { OrderStatusBadge } from '../../../shared/ui/order-status-badge/order-status-badge';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, OrderStatusBadge, LoadingState],
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
