// lib/catalogue.ts
//
// Server-side public catalogue API.

import { PRODUCT_CATEGORIES } from "@/lib/product-options";
import type { Product, ProductCategory } from "@/lib/types";
import {
  getCatalogueState,
  getPublicCatalogueProductByHandle,
  getPublicCatalogueProducts,
  type CatalogueSource,
  type CatalogueState,
} from "@/server/catalogue/state";

export type { CatalogueSource, CatalogueState };

/**
 * Returns all products from the configured public catalogue source.
 * Server-side only — do not import in client components.
 */
export async function getProducts(): Promise<Product[]> {
  return getPublicCatalogueProducts();
}

/**
 * Returns a single product by its URL handle, or null if not found.
 * Server-side only — do not import in client components.
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  return getPublicCatalogueProductByHandle(handle);
}

/**
 * Returns the list of product categories.
 * Categories are static and shared between all data sources.
 */
export function getCategories(): ProductCategory[] {
  return [...PRODUCT_CATEGORIES];
}

/**
 * Returns the current public catalogue source name for diagnostics.
 */
export async function getCatalogueSource(): Promise<CatalogueSource> {
  return (await getCatalogueState()).source;
}
