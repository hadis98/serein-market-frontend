import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderStore } from '../../../core/state/order-store';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
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
