import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminCustomerStore } from '../../../../core/state/admin-customer-store';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-admin-customers',
  styleUrl: './admin-customers.css',
  templateUrl: './admin-customers.html',
})
export class AdminCustomers {
  readonly customerStore = inject(AdminCustomerStore);

  readonly search = signal('');

  readonly filteredCustomers = computed(() => {
    const query = this.search().trim().toLocaleLowerCase();

    const customers = this.customerStore.customers();
    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phoneNumber.toLowerCase().includes(query),
    );
  });

  constructor() {
    void this.customerStore.load();
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;

    this.search.set(input.value);
  }
}
