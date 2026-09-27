import type { Product, SortOption } from '../../../core/models/product.model';

export interface ProductFilterCriteria {
  readonly categoryIds: readonly number[];
  readonly searchTerm: string;

  readonly minimumPrice: number;
  readonly maximumPrice: number;

  readonly inStockOnly: boolean;
}

// -----------------------------------------------------
// URL parsing
// -----------------------------------------------------

export function parseCategoryIds(
  multipleCategories: string | null,
  singleCategory: string | null,
): number[] {
  if (multipleCategories) {
    const categoryIds: number[] = [];

    for (const rawId of multipleCategories.split(',')) {
      const categoryId = Number(rawId);

      const isValid = Number.isInteger(categoryId) && categoryId > 0;

      const isDuplicate = categoryIds.includes(categoryId);

      if (isValid && !isDuplicate) {
        categoryIds.push(categoryId);
      }
    }

    return categoryIds;
  }

  const categoryId = Number(singleCategory);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return [];
  }

  return [categoryId];
}

export function parsePage(pageParam: string | null): number {
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page <= 0) {
    return 1;
  }

  return page;
}

// -----------------------------------------------------
// Price
// -----------------------------------------------------

export function calculatePriceLimit(products: readonly Product[]): number {
  let highestPrice = 0;

  for (const product of products) {
    highestPrice = Math.max(highestPrice, product.productPrice);
  }

  return Math.max(50, Math.ceil(highestPrice));
}

// -----------------------------------------------------
// Filtering
// -----------------------------------------------------

export function filterProducts(
  products: readonly Product[],
  filters: ProductFilterCriteria,
): Product[] {
  const searchTerm = filters.searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      filters.categoryIds.length === 0 || filters.categoryIds.includes(product.categoryId);

    const matchesSearch =
      searchTerm.length === 0 || product.productName.toLowerCase().includes(searchTerm);

    const matchesMinimumPrice = product.productPrice >= filters.minimumPrice;

    const matchesMaximumPrice = product.productPrice <= filters.maximumPrice;

    const matchesAvailability = !filters.inStockOnly || product.stockQuantity > 0;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesMinimumPrice &&
      matchesMaximumPrice &&
      matchesAvailability
    );
  });
}

// -----------------------------------------------------
// Sorting
// -----------------------------------------------------

export function sortProducts(products: readonly Product[], sortBy: SortOption): Product[] {
  // .sort() mutates an array.
  // We copy it first so the store's array is never mutated.
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.productPrice - b.productPrice);

    case 'price-high':
      return sortedProducts.sort((a, b) => b.productPrice - a.productPrice);

    case 'name':
      return sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));

    default:
      return sortedProducts;
  }
}

// -----------------------------------------------------
// Pagination
// -----------------------------------------------------

export function paginate<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;

  const endIndex = startIndex + pageSize;

  return items.slice(startIndex, endIndex);
}

// -----------------------------------------------------
// Small helpers
// -----------------------------------------------------

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function haveSameCategoryIds(
  currentIds: readonly number[],
  nextIds: readonly number[],
): boolean {
  if (currentIds.length !== nextIds.length) {
    return false;
  }

  return currentIds.every((id) => nextIds.includes(id));
}
