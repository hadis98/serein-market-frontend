import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerStore } from '../../../../core/state/customer-store';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-customers',
  styleUrl: './admin-customers.css',
  templateUrl: './admin-customers.html',
})
export class AdminCustomers {
  readonly customerStore = inject(CustomerStore);

  readonly search = signal('');

  readonly customers = computed(() => {
    const search = this.search().trim().toLowerCase();

    const customers = this.customerStore.customers();
    if (!search) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search) ||
        customer.mobileNo.toLowerCase().includes(search) ||
        String(customer.custId).includes(search),
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
