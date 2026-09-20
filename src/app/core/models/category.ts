export interface Category {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  parentCategoryId: number | null;
}
