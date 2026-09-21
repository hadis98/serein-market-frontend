import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_URL } from './api.config';
import {
  BackendOrderDetails,
  BackendOrderItem,
  BackendOrderSummary,
  CreateOrderRequest,
  OrderDetails,
  OrderSummary,
} from '../models/order.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${API_BASE_URL}/orders`;

  create(request: CreateOrderRequest) {
    return this.http
      .post<BackendOrderDetails>(this.baseUrl, request)
      .pipe(map((order) => this.toDetails(order)));
  }

  getMine() {
    return this.http
      .get<BackendOrderSummary[]>(`${this.baseUrl}/me`)
      .pipe(map((orders) => orders.map((order) => this.toSummary(order))));
  }

  getById(id: number) {
    return this.http
      .get<BackendOrderDetails>(`${this.baseUrl}/${id}`)
      .pipe(map((order) => this.toDetails(order)));
  }

  cancel(id: number) {
    return this.http.patch(`${this.baseUrl}/${id}/cancel`, {});
  }

  private toSummary(order: BackendOrderSummary): OrderSummary {
    return {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      subtotalAmount: Number(order.subtotalAmount),

      discountAmount: Number(order.discountAmount),

      totalAmount: Number(order.totalAmount),

      paymentMethod: order.paymentMethod,

      paymentStatus: order.paymentStatus,

      itemCount: order._count.items,

      createdAt: order.createdAt,

      updatedAt: order.updatedAt,
    };
  }

  private toDetails(order: BackendOrderDetails): OrderDetails {
    return {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      subtotalAmount: Number(order.subtotalAmount),

      discountAmount: Number(order.discountAmount),

      totalAmount: Number(order.totalAmount),

      paymentMethod: order.paymentMethod,

      paymentStatus: order.paymentStatus,

      delivery: {
        address1: order.deliveryAddressLine1,

        address2: order.deliveryAddressLine2 ?? '',

        city: order.deliveryCity,

        postalCode: order.deliveryPostalCode,

        landmark: order.deliveryLandmark ?? '',
      },

      items: order.items.map((item: BackendOrderItem) => ({
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
