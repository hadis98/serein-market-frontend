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

export interface ProductUpsertRequest {
  sku: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  imageUrl: string;
  deliveryEstimate?: string;
  stockQuantity: number;
  categoryId: number;
}

export type SortOption = 'default' | 'price-low' | 'price-high' | 'name';

export interface BackendProduct {
  id: number;
  sku: string;
  name: string;
  slug: string;

  shortDescription: string | null;
  description: string;

  price: string | number;
  imageUrl: string;

  deliveryEstimate: string | null;
  stockQuantity: number;
  status: ProductStatus;

  category: {
    id: number;
    name: string;
    slug: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  data: BackendProduct[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}