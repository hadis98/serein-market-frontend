export interface PlaceOrderRequest {
  SaleId: number;
  CustId: number;
  SaleDate: string;
  TotalInvoiceAmount: number;
  Discount: number;
  PaymentNaration: string;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryPinCode: string;
  DeliveryLandMark: string;
  IsCancelled: boolean;
}

export interface OrderItem {
  productId: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  localId: string;

  // Backend ID is unavailable from the current API.
  saleId: number | null;

  customerId: number;

  customer: {
    name: string;
    mobileNo: string;
  };

  saleDate: string;

  total: number;
  discount: number;

  paymentMethod: string;

  delivery: {
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    landmark: string;
  };

  items: OrderItem[];

  isCancelled: boolean;
}

export interface BackendSale {
  saleId: number;
  custId: number;
  saleDate: string;
  totalInvoiceAmount: number;
  discount: number;
  paymentNaration: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryLandMark: string;
  isCanceled: boolean;
}

export interface BackendSaleItem {
  categoryName: string;
  productId: number;
  saleItemId: number;
  productImageUrl: string;
  productName: string;
  productShortName: string;
  productPrice: number;
  quantity: number;
}
