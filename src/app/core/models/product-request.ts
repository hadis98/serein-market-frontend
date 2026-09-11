export interface ProductUpsertRequest {
  ProductId: number;
  ProductSku: string;
  ProductName: string;
  ProductPrice: number;
  ProductShortName: string;
  ProductDescription: string;
  CreatedDate: string;
  DeliveryTimeSpan: string;
  CategoryId: number;
  ProductImageUrl: string;
  UserId: number;
}
