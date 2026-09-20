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
