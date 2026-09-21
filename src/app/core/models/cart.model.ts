import { ProductStatus } from './product.model';

export interface CartProduct {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  stockQuantity: number;
  status: ProductStatus;
}

export interface CartItem {
  cartItemId: number;
  quantity: number;
  lineTotal: number;
  product: CartProduct;
}

export interface CartResponse {
  id: number;

  items: CartItem[];

  summary: {
    totalQuantity: number;
    subtotal: number;
  };
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface BackendCartResponse {
  id: number;

  items: {
    id: number;
    quantity: number;

    product: {
      id: number;
      sku: string;
      name: string;
      slug: string;
      price: string | number;
      imageUrl: string;
      stockQuantity: number;
      status: ProductStatus;
    };

    lineTotal: number;
    createdAt: string;
    updatedAt: string;
  }[];

  summary: {
    totalQuantity: number;
    subtotal: number;
  };
}
