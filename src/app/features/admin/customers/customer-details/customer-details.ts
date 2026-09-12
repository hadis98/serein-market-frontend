import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerApi } from '../../../../core/api/customer-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { Customer } from '../../../../core/models/customer';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [RouterLink],
  selector: 'app-customer-details',
  styleUrl: './customer-details.css',
  templateUrl: './customer-details.html',
})
export class CustomerDetails {
  private readonly currentRoute = inject(ActivatedRoute);

  private readonly api = inject(CustomerApi);

  private readonly params = toSignal(this.currentRoute.paramMap, {
    initialValue: this.currentRoute.snapshot.paramMap,
  });

  readonly customer = signal<Customer | null>(null);
  readonly loading = signal(false);

  readonly error = signal<string | null>(null);
  constructor() {
    effect(() => {
      const id = Number(this.params().get('id'));
      if (!Number.isFinite(id)) {
        return;
      }

      void this.loadCustomer(id);
    });
  }

  private async loadCustomer(id: number) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.api.getById(id));

      if (!response.result || !response.data) {
        throw new Error(response.message || 'Customer not found.');
      }

      this.customer.set({
        custId: response.data.custId,

        name: response.data.name,

        mobileNo: response.data.mobileNo,
      });
    } catch (error) {
      this.customer.set(null);

      this.error.set(error instanceof Error ? error.message : 'Customer could not be loaded.');
    } finally {
      this.loading.set(false);
    }
  }
}
