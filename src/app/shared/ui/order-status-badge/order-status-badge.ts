import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { OrderStatus } from '../../../core/models/order.model';

export interface OrderStatusPresentation {
  readonly backgroundColor: string;
  readonly textColor: string;
  readonly borderColor: string;
  readonly chartColor: string;
}

export const ORDER_STATUS_PRESENTATION: Record<OrderStatus, OrderStatusPresentation> = {
  PENDING: {
    backgroundColor: '#fff0d8',
    textColor: '#995b0a',
    borderColor: '#f2d7aa',
    chartColor: '#d69531',
  },
  CONFIRMED: {
    backgroundColor: '#e2efff',
    textColor: '#155b99',
    borderColor: '#c9def7',
    chartColor: '#4387c4',
  },
  SHIPPED: {
    backgroundColor: '#ebe8ff',
    textColor: '#4033a3',
    borderColor: '#d9d3fb',
    chartColor: '#7467c8',
  },
  DELIVERED: {
    backgroundColor: '#e0f2e5',
    textColor: '#21683a',
    borderColor: '#cae7d2',
    chartColor: '#4a9b67',
  },
  CANCELLED: {
    backgroundColor: '#fde4e4',
    textColor: '#a32424',
    borderColor: '#f4cccc',
    chartColor: '#d65d5d',
  },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-status-badge',
  template: `
    <span
      class="inline-flex min-w-[98px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold"
      [style.background-color]="presentation().backgroundColor"
      [style.border-color]="presentation().borderColor"
      [style.color]="presentation().textColor"
    >
      @if (prefix()) {
        <span>{{ prefix() }}</span>
      }
      <span>{{ status() }}</span>
    </span>
  `,
})
export class OrderStatusBadge {
  readonly status = input.required<OrderStatus>();
  readonly prefix = input('');

  protected readonly presentation = computed(() => ORDER_STATUS_PRESENTATION[this.status()]);
}
