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
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastStore);
  private readonly router = inject(Router);

  readonly checkoutModel = signal<CheckoutDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
  });

  readonly checkoutForm = form(
    this.checkoutModel,

    (path) => {
      required(path.fullName, {
        message: 'Full name is required',
      });

      required(path.email, {
        message: 'Email is required',
      });

      email(path.email, {
        message: 'Enter a valid email address',
      });

      required(path.phone, {
        message: 'Phone number is required',
      });

      minLength(path.phone, 10, {
        message: 'Enter a valid phone number',
      });

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
          const customer = this.auth.customer();

          if (!customer) {
            return;
          }

          const form = this.checkoutModel();

          try {
            await this.cart.syncToBackend(customer.custId);

            const order = await this.orders.placeOrder({
              SaleId: 0,

              CustId: customer.custId,

              SaleDate: new Date().toISOString(),

              TotalInvoiceAmount: this.cart.subtotal(),

              Discount: 0,

              PaymentNaration: form.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card',

              DeliveryAddress1: form.address,

              DeliveryAddress2: '',

              DeliveryCity: form.city,

              DeliveryPinCode: form.postalCode,

              DeliveryLandMark: '',

              IsCancelled: false,
            });

            const total = order.total;

            this.cart.clear();

            await this.router.navigate(['/order-success'], {
              state: {
                total,
                orderId: order.localId,
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
