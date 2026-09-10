import { computed, inject, Injectable, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { OrderApi } from '../api/order-api';
import { AuthStore } from '../auth/auth-store';
import { CartStore } from './cart-store';

import { Order, PlaceOrderRequest } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderStore {
  private readonly api = inject(OrderApi);
  private readonly auth = inject(AuthStore);
  private readonly cart = inject(CartStore);

  private readonly ordersState = signal<Order[]>(this.load());

  private load(): Order[] {
    const saved = localStorage.getItem('serein-orders');

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  readonly orders = computed(() => {
    const customerId = this.auth.customer()?.custId;

    if (!customerId) {
      return [];
    }

    return this.ordersState()
      .filter((order) => order.customerId === customerId)
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  });

  getById(id: string) {
    return this.orders().find((order) => order.localId === id);
  }

  private save() {
    localStorage.setItem('serein-orders', JSON.stringify(this.ordersState()));
  }

  async placeOrder(request: PlaceOrderRequest) {
    const customer = this.auth.customer();

    if (!customer) {
      throw new Error('You must be logged in.');
    }

    const response = await firstValueFrom(this.api.placeOrder(request));

    if (!response.result) {
      throw new Error(response.message || 'Order could not be placed.');
    }

    const order: Order = {
      localId: crypto.randomUUID(),

      // PlaceOrder does not return the created sale ID.
      saleId: null,

      customerId: customer.custId,

      customer: {
        name: customer.name,
        mobileNo: customer.mobileNo,
      },

      saleDate: request.SaleDate,

      total: request.TotalInvoiceAmount,

      discount: request.Discount,

      paymentMethod: request.PaymentNaration,

      delivery: {
        address1: request.DeliveryAddress1,
        address2: request.DeliveryAddress2,
        city: request.DeliveryCity,
        postalCode: request.DeliveryPinCode,
        landmark: request.DeliveryLandMark,
      },

      items: this.cart.items().map((item) => ({
        productId: item.product.productId,
        name: item.product.productName,
        imageUrl: item.product.productImageUrl,
        price: item.product.productPrice,
        quantity: item.quantity,
      })),

      isCancelled: false,
    };

    this.ordersState.update((orders) => [order, ...orders]);

    this.save();

    return order;
  }
}
