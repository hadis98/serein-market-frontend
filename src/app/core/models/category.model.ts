export type CategorySortOption = 'name-asc' | 'name-desc' | 'products-high' | 'products-low';
export interface Category {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  categoryImageUrl: string | null;
  parentCategoryId: number | null;

  productCount: number;
  childCount: number;
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

  _count: {
    products: number;
    children: number;
  };
}

export interface CategoryParent {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
}

export interface CategoryDetails extends Category {
  parentCategory: CategoryParent | null;

  productCount: number;
  childCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface BackendCategoryDetails extends BackendCategory {
  parent: {
    id: number;
    name: string;
    slug: string;
  } | null;

  _count: {
    products: number;
    children: number;
  };

  createdAt: string;
  updatedAt: string;
}
