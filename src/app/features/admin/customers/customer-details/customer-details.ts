import { Component, inject, OnInit, signal } from '@angular/core';

import { CurrencyPipe, DatePipe } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { AdminCustomerStore } from '../../../../core/state/admin-customer-store';

import type { AdminCustomerDetails as AdminCustomerDetailsModel } from '../../../../core/models/admin-customer.model';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],

  selector: 'app-admin-customer-details',

  styleUrl: './customer-details.css',

  templateUrl: './customer-details.html',
})
export class CustomerDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly customerStore = inject(AdminCustomerStore);

  readonly customer = signal<AdminCustomerDetailsModel | null>(null);

  readonly loading = signal(true);

  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error.set('Invalid customer.');

      this.loading.set(false);

      return;
    }

    const id = Number(idParam);

    if (Number.isNaN(id)) {
      this.error.set('Invalid customer.');

      this.loading.set(false);

      return;
    }

    try {
      const customer = await this.customerStore.loadById(id);

      this.customer.set(customer);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Customer could not be loaded.');
    } finally {
      this.loading.set(false);
    }
  }
}
