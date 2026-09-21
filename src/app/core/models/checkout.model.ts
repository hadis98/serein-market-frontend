export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD';
export interface CheckoutDetails {
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
}
