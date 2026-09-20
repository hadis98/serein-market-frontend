import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { map } from 'rxjs';

import { API_BASE_URL } from './api.config';

import type { OrderStatus, PaymentMethod, PaymentStatus } from '../models/order';

import type {
  AdminCustomerDetails,
  AdminCustomerSummary,
  BackendAdminCustomerDetails,
  BackendAdminCustomerSummary,
} from '../models/admin-customer';

@Injectable({
  providedIn: 'root',
})
export class AdminCustomerApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/admin/customers`;
  getAll() {
    return this.http
      .get<BackendAdminCustomerSummary[]>(this.baseUrl)
      .pipe(map((customers) => customers.map((customer) => this.toSummary(customer))));
  }

  getById(id: number) {
    return this.http
      .get<BackendAdminCustomerDetails>(`${this.baseUrl}/${id}`)
      .pipe(map((customer) => this.toDetails(customer)));
  }

  private toSummary(customer: BackendAdminCustomerSummary): AdminCustomerSummary {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      orderCount: customer._count.orders,
      createdAt: customer.createdAt,
    };
  }

  private toDetails(customer: BackendAdminCustomerDetails): AdminCustomerDetails {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      orderCount: customer.orders.length,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,

      orders: customer.orders.map((order) => ({
        id: order.id,

        orderNumber: order.orderNumber,

        status: order.status,

        totalAmount: Number(order.totalAmount),

        paymentMethod: order.paymentMethod,

        paymentStatus: order.paymentStatus,

        createdAt: order.createdAt,
      })),
    };
  }
}
