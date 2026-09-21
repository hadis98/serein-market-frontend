import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { AdminCustomerApi } from '../api/admin-customer-api';

import type { AdminCustomerDetails, AdminCustomerSummary } from '../models/admin-customer.model';

@Injectable({
  providedIn: 'root',
})
export class AdminCustomerStore {
  private readonly api = inject(AdminCustomerApi);

  private readonly customersState = signal<AdminCustomerSummary[]>([]);

  private readonly loadingState = signal(false);

  private readonly loadedState = signal(false);

  private readonly errorState = signal<string | null>(null);

  readonly customers = this.customersState.asReadonly();

  readonly loading = this.loadingState.asReadonly();

  readonly error = this.errorState.asReadonly();

  readonly count = computed(() => this.customersState().length);

  async load(force = false): Promise<void> {
    if (this.loadingState()) {
      return;
    }

    if (this.loadedState() && !force) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const customers = await firstValueFrom(this.api.getAll());

      this.customersState.set(customers);

      this.loadedState.set(true);
    } catch (error) {
      this.errorState.set(this.getErrorMessage(error, 'Customers could not be loaded.'));
    } finally {
      this.loadingState.set(false);
    }
  }

  async loadById(id: number): Promise<AdminCustomerDetails> {
    try {
      return await firstValueFrom(this.api.getById(id));
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Customer could not be loaded.'));
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const message = error.error?.message;

    return Array.isArray(message) ? message.join(', ') : (message ?? fallback);
  }
}
