export type ProductStatus = 'ACTIVE' | 'ARCHIVED';

export interface ProductPreview {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: number;

  productShortDescription: string;

  productImageUrl: string;

  categoryId: number;
  categoryName: string;

  stockQuantity: number;
  status: ProductStatus;

  slug: string;
}

export interface Product extends ProductPreview {
  productDescription: string;

  createdDate: string;

  deliveryTimeSpan: string;
}

export type SortOption = 'default' | 'price-low' | 'price-high' | 'name';
