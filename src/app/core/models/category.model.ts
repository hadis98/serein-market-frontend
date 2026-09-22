export type CategorySortOption = 'name-asc' | 'name-desc' | 'products-high' | 'products-low';
export interface Category {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  categoryImageUrl: string | null;
  parentCategoryId: number | null;
}

export interface CreateCategoryRequest {
  name: string;
  imageUrl: string;
  parentId?: number;
}

export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  parentId: number | null;
}
