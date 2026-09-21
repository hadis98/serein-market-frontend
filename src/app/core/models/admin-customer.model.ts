import type { OrderStatus, PaymentMethod, PaymentStatus } from './order.model';

export interface AdminCustomerSummary {
  id: number;

  name: string;
  email: string;
  phoneNumber: string;

  orderCount: number;

  createdAt: string;
}

export interface AdminCustomerOrder {
  id: number;
  orderNumber: string;

  status: OrderStatus;

  totalAmount: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  createdAt: string;
}

export interface AdminCustomerDetails extends AdminCustomerSummary {
  orders: AdminCustomerOrder[];

  updatedAt: string;
}

export interface BackendAdminCustomerSummary {
  id: number;

  name: string;
  email: string;
  phoneNumber: string;

  createdAt: string;

  _count: {
    orders: number;
  };
}

export interface BackendAdminCustomerDetails {
  id: number;

  name: string;
  email: string;
  phoneNumber: string;

  createdAt: string;
  updatedAt: string;

  orders: {
    id: number;
    orderNumber: string;

    status: OrderStatus;

    totalAmount: string | number;

    paymentMethod: PaymentMethod;

    paymentStatus: PaymentStatus;

    createdAt: string;
  }[];
}
