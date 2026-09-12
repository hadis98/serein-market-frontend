import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AddToCartRequest {
  CartId: number;
  CustId: number;
  ProductId: number;
  Quantity: number;
  AddedDate: string;
}

export interface BackendCartItem {
  cartId: number;
  custId: number;
  productId: number;
  quantity: number;
  productShortName: string;
  addedDate: string;
  productName: string;
  categoryName: string;
  productImageUrl: string;
  productPrice: number;
}