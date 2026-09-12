import { computed, inject, Injectable, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { CustomerApi } from '../api/customer-api';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerStore {
  private readonly api = inject(CustomerApi);
  private readonly customersState = signal<Customer[]>([]);
  private readonly loadingState = signal(false);
  private readonly loadedState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly customers = this.customersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly count = computed(() => this.customersState().length);

  async load(force = false) {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const response = await firstValueFrom(this.api.getAll());

      if (!response.result) {
        throw new Error(response.message || 'Customers could not be loaded.');
      }

      const customers: Customer[] = (response.data ?? []).map((customer) => ({
        custId: customer.custId,

        name: customer.name,

        mobileNo: customer.mobileNo,
      }));

      this.customersState.set(customers);

      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : 'Customers could not be loaded.',
      );
    } finally {
      this.loadingState.set(false);
    }
  }

  getById(id: number) {
    return this.customersState().find((customer) => customer.custId === id);
  }
}
