export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface CreateOrderRequest {
  paymentMethod: PaymentMethod;

  deliveryAddressLine1: string;

  deliveryAddressLine2?: string;

  deliveryCity: string;

  deliveryPostalCode: string;

  deliveryLandmark?: string;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;

  status: OrderStatus;

  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  itemCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;

  name: string;
  sku: string;
  imageUrl: string;

  price: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDetails {
  id: number;
  orderNumber: string;

  status: OrderStatus;

  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  delivery: {
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    landmark: string;
  };

  items: OrderItem[];

  createdAt: string;
  updatedAt: string;
}

export interface BackendOrderSummary {
  id: number;
  orderNumber: string;
  status: OrderStatus;

  subtotalAmount: string | number;

  discountAmount: string | number;

  totalAmount: string | number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  _count: {
    items: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface BackendOrderDetails {
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

  items: BackendOrderItem[];

  createdAt: string;
  updatedAt: string;
}

export interface BackendOrderItem {
  id: number;
  productId: number;

  productNameSnapshot: string;

  productSkuSnapshot: string;

  productImageUrlSnapshot: string;

  unitPrice: string | number;

  quantity: number;

  lineTotal: string | number;
}
