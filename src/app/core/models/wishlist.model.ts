import type { ProductPreview, ProductStatus } from './product.model';

// export interface WishlistProduct {
//   productId: number;
//   productSku: string;
//   productName: string;
//   productPrice: number;
//   productImageUrl: string;
//   stockQuantity: number;
//   status: ProductStatus;
//   slug: string;
// }

export interface WishlistItem {
  wishlistItemId: number;
  product: ProductPreview;
  createdAt: string;
}

export interface WishlistResponse {
  id: number;
  items: WishlistItem[];
}

export interface AddWishlistItemRequest {
  productId: number;
}

export interface BackendWishlistResponse {
  id: number;

  items: {
    id: number;

    product: {
      id: number;
      sku: string;
      name: string;
      slug: string;
      shortDescription: string;
      price: string | number;

      imageUrl: string;

      stockQuantity: number;

      status: ProductStatus;

      category: {
        id: number;
        name: string;
        slug: string;
      };
    };

    createdAt: string;
    updatedAt: string;
  }[];
}
