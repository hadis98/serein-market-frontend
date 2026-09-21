import type {
  BackendOrderItem,
  OrderDetails,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './order.model';

export interface AdminOrderCustomer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface AdminOrderSummary {
  id: number;
  orderNumber: string;

  status: OrderStatus;

  totalAmount: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  itemCount: number;

  customer: AdminOrderCustomer;

  createdAt: string;
}

export interface AdminOrderDetails extends OrderDetails {
  customer: AdminOrderCustomer;
}

export interface BackendAdminOrderCustomer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface BackendAdminOrderSummary {
  id: number;
  orderNumber: string;

  status: OrderStatus;

  totalAmount: string | number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  user: BackendAdminOrderCustomer;

  _count: {
    items: number;
  };

  createdAt: string;
}

export interface BackendAdminOrderDetails {
  id: number;
  orderNumber: string;

  status: OrderStatus;

  subtotalAmount: string | number;

  discountAmount: string | number;

  totalAmount: string | number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  deliveryAddressLine1: string;

  deliveryAddressLine2: string | null;

  deliveryCity: string;

  deliveryPostalCode: string;

  deliveryLandmark: string | null;

  user: BackendAdminOrderCustomer;

  items: BackendOrderItem[];

  createdAt: string;
  updatedAt: string;
}

export interface BackendUpdateOrderStatusResponse {
  id: number;
  orderNumber: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  updatedAt: string;
}
