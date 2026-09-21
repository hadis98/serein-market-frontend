import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { map } from 'rxjs';

import { API_BASE_URL } from './api.config';

import type { OrderStatus, PaymentMethod, PaymentStatus } from '../models/order.model';

import type {
  AdminOrderDetails,
  AdminOrderSummary,
  BackendAdminOrderDetails,
  BackendAdminOrderSummary,
  BackendUpdateOrderStatusResponse,
} from '../models/admin-order.model';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/admin/orders`;

  getAll() {
    return this.http
      .get<BackendAdminOrderSummary[]>(this.baseUrl)
      .pipe(map((orders) => orders.map((order) => this.toSummary(order))));
  }

  getById(id: number) {
    return this.http
      .get<BackendAdminOrderDetails>(`${this.baseUrl}/${id}`)
      .pipe(map((order) => this.toDetails(order)));
  }

  updateStatus(id: number, status: OrderStatus) {
    return this.http
      .patch<BackendUpdateOrderStatusResponse>(`${this.baseUrl}/${id}/status`, {
        status,
      });
  }

  private toSummary(order: BackendAdminOrderSummary): AdminOrderSummary {
    return {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      totalAmount: Number(order.totalAmount),

      paymentMethod: order.paymentMethod,

      paymentStatus: order.paymentStatus,

      itemCount: order._count.items,

      customer: {
        id: order.user.id,

        name: order.user.name,

        email: order.user.email,

        phoneNumber: order.user.phoneNumber,
      },

      createdAt: order.createdAt,
    };
  }

  private toDetails(order: BackendAdminOrderDetails): AdminOrderDetails {
    return {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      subtotalAmount: Number(order.subtotalAmount),

      discountAmount: Number(order.discountAmount),

      totalAmount: Number(order.totalAmount),

      paymentMethod: order.paymentMethod,

      paymentStatus: order.paymentStatus,

      customer: {
        id: order.user.id,

        name: order.user.name,

        email: order.user.email,

        phoneNumber: order.user.phoneNumber,
      },

      delivery: {
        address1: order.deliveryAddressLine1,

        address2: order.deliveryAddressLine2 ?? '',

        city: order.deliveryCity,

        postalCode: order.deliveryPostalCode,

        landmark: order.deliveryLandmark ?? '',
      },

      items: order.items.map((item) => ({
        id: item.id,

        productId: item.productId,

        name: item.productNameSnapshot,

        sku: item.productSkuSnapshot,

        imageUrl: item.productImageUrlSnapshot,

        price: Number(item.unitPrice),

        quantity: item.quantity,

        lineTotal: Number(item.lineTotal),
      })),

      createdAt: order.createdAt,

      updatedAt: order.updatedAt,
    };
  }
}
