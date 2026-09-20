import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { CartStore } from '../../../core/state/cart-store';
import { CheckoutDetails } from '../../../core/models/checkout-details';
import { OrderStore } from '../../../core/state/order-store';
import { ToastStore } from '../../../core/state/toast-store';
import { AuthStore } from '../../../core/auth/auth-store';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, FormField, FormRoot],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  readonly cart = inject(CartStore);
  private readonly orders = inject(OrderStore);
  private readonly toast = inject(ToastStore);
  private readonly router = inject(Router);

  readonly checkoutModel = signal<CheckoutDetails>({
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'CARD',
  });

  readonly checkoutForm = form(
    this.checkoutModel,

    (path) => {
      required(path.address, {
        message: 'Address is required',
      });

      required(path.city, {
        message: 'City is required',
      });

      required(path.postalCode, {
        message: 'Postal code is required',
      });
    },

    {
      submission: {
        action: async () => {
          const form = this.checkoutModel();

          try {
            const order = await this.orders.placeOrder({
              paymentMethod: form.paymentMethod,

              deliveryAddressLine1: form.address,

              deliveryCity: form.city,

              deliveryPostalCode: form.postalCode,
            });

            await this.cart.load(true);

            await this.router.navigate(['/order-success'], {
              state: {
                total: order.totalAmount,
                orderId: order.id,
              },
            });
          } catch (error) {
            this.toast.show(
              error instanceof Error ? error.message : 'Could not place your order.',
              'error',
            );
          }
        },
      },
    },
  );
}
