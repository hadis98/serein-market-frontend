import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthApi } from './auth-api';
import { Customer, LoginRequest, RegisterCustomerRequest } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authApi = inject(AuthApi);
  private readonly storageKey = 'serein-customer';

  private readonly customerState = signal<Customer | null>(this.loadCustomer());
  readonly customer = this.customerState.asReadonly();

  readonly isLoggedIn = computed(() => this.customerState() !== null);

  readonly firstName = computed(() => {
    const name = this.customerState()?.name ?? '';
    return name.split(' ')[0];
  });

  async register(request: RegisterCustomerRequest) {
    const response = await firstValueFrom(this.authApi.register(request));

    if (!response.result) {
      throw new Error(response.message || 'Registeration failed');
    }
    return response;
  }

  async login(request: LoginRequest) {
    const response = await firstValueFrom(this.authApi.login(request));
    if (!response.result || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    const customer: Customer = {
      custId: response.data.custId,
      name: response.data.name,
      mobileNo: response.data.mobileNo,
    };

    this.customerState.set(customer);
    localStorage.setItem(this.storageKey, JSON.stringify(customer));
  }

  logout() {
    this.customerState.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private loadCustomer(): Customer | null {
    const savedCustomer = localStorage.getItem(this.storageKey);

    if (!savedCustomer) {
      return null;
    }
    try {
      return JSON.parse(savedCustomer);
    } catch {
      return null;
    }
  }
}
