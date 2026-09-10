import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStore } from '../../../core/state/order-store';



@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-order-details',
  styleUrl: './order-details.css',
  templateUrl: './order-details.html',
})
export class OrderDetails {
  private readonly route = inject(ActivatedRoute);

  readonly orderStore = inject(OrderStore);
  readonly order = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');

    return id ? this.orderStore.getById(id) : undefined;
  });
}
